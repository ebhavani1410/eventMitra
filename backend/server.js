import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "data.json");
const port = Number(process.env.PORT || 4000);
const secret = process.env.JWT_SECRET || "replace-this-local-development-secret";
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));

const stamp = () => new Date().toISOString();
const id = (prefix) => `${prefix}-${randomUUID()}`;
const save = () => writeFileSync(dataPath, JSON.stringify(db, null, 2));
const seed = () => ({
  users: [
    { id:"customer-1", name:"Priya Sharma", email:"customer@eventmithra.com", phone:"9876543210", role:"customer", city:"Hyderabad", password:"Demo@123", approved:true },
    { id:"manager-1", name:"Ravi Kumar", email:"manager@eventmithra.com", phone:"9876543211", role:"manager", city:"Hyderabad", password:"Demo@123", approved:true },
    { id:"venue-1", name:"Anita Reddy", email:"venue@eventmithra.com", phone:"9876543212", role:"venue", city:"Hyderabad", password:"Demo@123", approved:true },
    { id:"admin-1", name:"EventMithra Admin", email:"admin@eventmithra.com", phone:"9876543213", role:"admin", password:"Demo@123", approved:true },
  ],
  managers:[{id:"manager-1",userId:"manager-1",businessName:"Ravi Events",location:"Hyderabad",experience:8,rating:4.8,services:["Venue","Catering","Decoration","Photography"],startingPrice:65000}],
  venues:[{id:"venue-1",managerId:"venue-1",name:"Grand Convention Hall",location:"Hyderabad",area:"Madhapur",capacity:500,pricePerEvent:120000,rating:4.7,amenities:["AC","Parking","Catering","Stage"]}],
  events:[], requests:[], inquiries:[], proposals:[], bookings:[], payments:[], messages:[], notifications:[], reviews:[]
});
if (!existsSync(dataPath)) { mkdirSync(__dirname, { recursive:true }); writeFileSync(dataPath, JSON.stringify(seed(), null, 2)); }
let db = JSON.parse(readFileSync(dataPath, "utf8"));
const publicUser = ({ password, ...user }) => user;
const notify = (userId, title, message) => db.notifications.push({ id:id("note"),userId,title,message,read:false,createdAt:stamp() });
const auth = (roles) => (req,res,next) => { try { const token=req.headers.authorization?.replace("Bearer ",""); const user=jwt.verify(token,secret); if(roles&&!roles.includes(user.role)) return res.status(403).json({message:"Insufficient role"}); req.user=user; next(); } catch { res.status(401).json({message:"Authentication required"}); } };
const eventFor = (eventId) => db.events.find(x=>x.id===eventId);
const owned = (resource, user) => user.role==="admin" || resource.customerId===user.id || resource.managerId===user.id || resource.userId===user.id;

app.get("/api/health", (_,res) => res.json({status:"ok",service:"EventMithra API",time:stamp()}));
app.post("/api/auth/login", async (req,res) => { const user=db.users.find(u=>u.email.toLowerCase()===String(req.body.email||"").toLowerCase()); if(!user) return res.status(401).json({message:"Invalid email or password"}); const valid=user.password==="Demo@123" ? req.body.password==="Demo@123" : await bcrypt.compare(req.body.password||"",user.password); if(!valid) return res.status(401).json({message:"Invalid email or password"}); const token=jwt.sign({id:user.id,role:user.role,email:user.email},secret,{expiresIn:"8h"}); res.json({token,user:publicUser(user)}); });
app.post("/api/auth/signup", async (req,res) => { const {name,email,password,phone="",role="customer",city=""}=req.body; if(!name||!email||!password||!["customer","manager","venue"].includes(role)) return res.status(400).json({message:"Invalid registration data"}); if(db.users.some(u=>u.email.toLowerCase()===email.toLowerCase())) return res.status(409).json({message:"Email already registered"}); const user={id:id("user"),name,email,phone,role,city,password:await bcrypt.hash(password,12),approved:role==="customer"}; db.users.push(user);save(); const token=jwt.sign({id:user.id,role:user.role,email:user.email},secret,{expiresIn:"8h"});res.status(201).json({token,user:publicUser(user)}); });
app.get("/api/events",auth(),(req,res)=>res.json(db.events.filter(e=>req.user.role==="admin"||e.customerId===req.user.id||db.requests.some(r=>r.eventId===e.id&&r.managerId===req.user.id))));
app.post("/api/events",auth(["customer"]),(req,res)=>{const body=req.body;if(!body.eventName||!body.date||new Date(`${body.date}T00:00:00`)<new Date(new Date().toDateString())) return res.status(400).json({message:"A future event name and date are required"});const event={...body,id:id("EVT"),customerId:req.user.id,status:"draft",createdAt:stamp()};db.events.push(event);save();res.status(201).json(event);});
app.get("/api/managers",auth(),(_,res)=>res.json(db.managers));
app.post("/api/events/:eventId/requests",auth(["customer"]),(req,res)=>{const event=eventFor(req.params.eventId);if(!event||event.customerId!==req.user.id)return res.status(404).json({message:"Event not found"});if(!db.managers.some(m=>m.id===req.body.managerId))return res.status(404).json({message:"Manager not found"});const request={id:id("REQ"),eventId:event.id,customerId:req.user.id,managerId:req.body.managerId,status:"pending",createdAt:stamp()};db.requests.push(request);event.status="requested";notify(request.managerId,"New event request",`${event.eventName} needs your help.`);save();res.status(201).json(request);});
app.get("/api/requests",auth(),(req,res)=>res.json(db.requests.filter(r=>owned(r,req.user))));
app.patch("/api/requests/:id",auth(["manager"]),(req,res)=>{const request=db.requests.find(r=>r.id===req.params.id&&r.managerId===req.user.id);if(!request)return res.status(404).json({message:"Request not found"});request.status=req.body.status==="accepted"?"accepted":"rejected";const event=eventFor(request.eventId);event.status=request.status==="accepted"?"in_progress":"draft";notify(request.customerId,request.status==="accepted"?"Manager accepted":"Request declined",request.status==="accepted"?"Your manager is finding venues.":"Choose another manager.");save();res.json(request);});
app.get("/api/venues",auth(),(_,res)=>res.json(db.venues));
app.post("/api/inquiries",auth(["manager"]),(req,res)=>{const event=eventFor(req.body.eventId);const venue=db.venues.find(v=>v.id===req.body.venueId);if(!event||!venue)return res.status(404).json({message:"Event or venue not found"});const inquiry={id:id("INQ"),eventId:event.id,managerId:req.user.id,venueId:venue.id,message:req.body.message||"",status:"pending",createdAt:stamp()};db.inquiries.push(inquiry);notify(venue.managerId,"New venue inquiry",`${event.eventName} needs availability.`);save();res.status(201).json(inquiry);});
app.get("/api/inquiries",auth(),(req,res)=>res.json(db.inquiries.filter(i=>req.user.role==="admin"||i.managerId===req.user.id||db.venues.find(v=>v.id===i.venueId)?.managerId===req.user.id)));
app.patch("/api/inquiries/:id",auth(["venue"]),(req,res)=>{const inquiry=db.inquiries.find(i=>i.id===req.params.id&&db.venues.find(v=>v.id===i.venueId)?.managerId===req.user.id);if(!inquiry)return res.status(404).json({message:"Inquiry not found"});inquiry.status=req.body.accepted?"quoted":"rejected";inquiry.quote=req.body.quote;notify(inquiry.managerId,inquiry.status==="quoted"?"Venue quotation received":"Venue inquiry declined",inquiry.status==="quoted"?`Quote received: ₹${inquiry.quote}`:"Please try another venue.");save();res.json(inquiry);});
app.post("/api/proposals",auth(["manager"]),(req,res)=>{const event=eventFor(req.body.eventId);const request=db.requests.find(r=>r.eventId===req.body.eventId&&r.managerId===req.user.id&&r.status==="accepted");if(!event||!request)return res.status(400).json({message:"Accepted request required"});const items=req.body.items||[];const proposal={id:id("PROP"),eventId:event.id,customerId:event.customerId,managerId:req.user.id,venueId:req.body.venueId,title:req.body.title||`${event.eventName} proposal`,description:req.body.description||"",items,totalAmount:items.reduce((sum,item)=>sum+Number(item.price||0)*Number(item.quantity||1),0),status:"sent",expiry:req.body.expiry||null,createdAt:stamp()};db.proposals.push(proposal);event.status="proposal_sent";notify(event.customerId,"Your proposal is ready",`Review the proposal for ${event.eventName}.`);save();res.status(201).json(proposal);});
app.get("/api/proposals",auth(),(req,res)=>res.json(db.proposals.filter(p=>owned(p,req.user))));
app.patch("/api/proposals/:id/decision",auth(["customer"]),(req,res)=>{const proposal=db.proposals.find(p=>p.id===req.params.id&&p.customerId===req.user.id);if(!proposal)return res.status(404).json({message:"Proposal not found"});proposal.status=req.body.decision;if(req.body.decision==="accepted"){const booking={id:id("BK"),eventId:proposal.eventId,customerId:proposal.customerId,managerId:proposal.managerId,venueId:proposal.venueId,proposalId:proposal.id,amount:proposal.totalAmount,deposit:Math.round(proposal.totalAmount*.25),paymentStatus:"pending",bookingStatus:"pending",createdAt:stamp()};db.bookings.push(booking);notify(proposal.managerId,"Proposal accepted","Customer accepted your proposal.");save();return res.json({proposal,booking});}notify(proposal.managerId,"Proposal response",req.body.message||proposal.status);save();res.json({proposal});});
app.get("/api/bookings",auth(),(req,res)=>res.json(db.bookings.filter(b=>owned(b,req.user)||db.venues.find(v=>v.id===b.venueId)?.managerId===req.user.id)));
app.post("/api/bookings/:id/payments",auth(["customer"]),(req,res)=>{const booking=db.bookings.find(b=>b.id===req.params.id&&b.customerId===req.user.id);if(!booking)return res.status(404).json({message:"Booking not found"});const payment={id:id("PAY"),bookingId:booking.id,amount:booking.deposit,status:"paid",method:req.body.method||"upi",paidAt:stamp()};db.payments.push(payment);booking.paymentStatus="paid";booking.bookingStatus="confirmed";eventFor(booking.eventId).status="confirmed";notify(booking.managerId,"Booking confirmed","The deposit has been paid.");notify(db.venues.find(v=>v.id===booking.venueId)?.managerId,"Booking confirmed","A new booking is confirmed.");save();res.status(201).json({payment,booking});});
app.get("/api/notifications",auth(),(req,res)=>res.json(db.notifications.filter(n=>n.userId===req.user.id)));
app.patch("/api/notifications/:id/read",auth(),(req,res)=>{const n=db.notifications.find(n=>n.id===req.params.id&&n.userId===req.user.id);if(!n)return res.status(404).json({message:"Notification not found"});n.read=true;save();res.json(n);});
app.get("/api/messages",auth(),(req,res)=>res.json(db.messages.filter(m=>m.senderId===req.user.id||m.receiverId===req.user.id)));
app.post("/api/messages",auth(),(req,res)=>{if(!db.users.some(u=>u.id===req.body.receiverId)||!req.body.text?.trim())return res.status(400).json({message:"Recipient and text are required"});const message={id:id("MSG"),senderId:req.user.id,receiverId:req.body.receiverId,text:req.body.text.trim(),read:false,createdAt:stamp()};db.messages.push(message);notify(message.receiverId,"New message",`${req.user.email}: ${message.text.slice(0,45)}`);save();res.status(201).json(message);});
app.post("/api/reviews",auth(["customer"]),(req,res)=>{const booking=db.bookings.find(b=>b.id===req.body.bookingId&&b.customerId===req.user.id);if(!booking)return res.status(404).json({message:"Booking not found"});const review={id:id("REV"),bookingId:booking.id,customerId:req.user.id,targetId:req.body.targetId,rating:Number(req.body.rating),comment:req.body.comment||"",createdAt:stamp()};db.reviews.push(review);save();res.status(201).json(review);});
app.post("/api/dev/reset",auth(["admin"]),(_,res)=>{db=seed();save();res.json({message:"Demo data reset"});});
app.use((_,res)=>res.status(404).json({message:"Route not found"}));
app.listen(port,()=>console.log(`EventMithra API listening on http://localhost:${port}`));
