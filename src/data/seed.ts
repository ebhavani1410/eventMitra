import type { EventManager, User, Venue } from "../types";
export const demoUsers: User[] = [
 {id:"customer-1",name:"Priya Sharma",email:"customer@eventmithra.com",phone:"9876543210",role:"customer",city:"Hyderabad",approved:true}, {id:"manager-1",name:"Ravi Kumar",email:"manager@eventmithra.com",phone:"9876543211",role:"manager",city:"Hyderabad",approved:true}, {id:"venue-1",name:"Anita Reddy",email:"venue@eventmithra.com",phone:"9876543212",role:"venue",city:"Hyderabad",approved:true}, {id:"admin-1",name:"EventMithra Admin",email:"admin@eventmithra.com",phone:"9876543213",role:"admin",approved:true}
];
export const managers: EventManager[] = [
 {id:"manager-1",userId:"manager-1",businessName:"Ravi Events",description:"Beautiful, stress-free celebrations from concept to curtain call.",location:"Hyderabad",experience:8,rating:4.8,reviews:126,services:["Venue","Catering","Decoration","Photography"],startingPrice:65000,verified:true,categories:["Wedding","Birthday","Corporate Event"]},
 {id:"manager-2",userId:"manager-2",businessName:"Mango Leaf Events",description:"Warm, thoughtful events with a contemporary touch.",location:"Jubilee Hills",experience:6,rating:4.6,reviews:88,services:["Decoration","Photography","DJ/Music"],startingPrice:45000,verified:true,categories:["Engagement","Birthday","Reception"]},
 {id:"manager-3",userId:"manager-3",businessName:"Elevate Planners",description:"Corporate and conference specialists.",location:"Gachibowli",experience:10,rating:4.9,reviews:210,services:["Venue","Catering","Lighting"],startingPrice:90000,verified:true,categories:["Corporate Event","Conference"]}
];
export const venues: Venue[] = [
 {id:"venue-1",managerId:"venue-1",name:"Grand Convention Hall",location:"Hyderabad",area:"Madhapur",description:"A flexible, elegant convention venue for celebrations of every scale.",capacity:500,pricePerEvent:120000,amenities:["AC","Parking","Catering","Stage","Accessibility"],rating:4.7,reviews:154,verified:true,type:"Convention Hall"},
 {id:"venue-2",managerId:"venue-2",name:"Olive Gardens",location:"Hyderabad",area:"Jubilee Hills",description:"Lush outdoor lawns with a refined indoor pavilion.",capacity:250,pricePerEvent:85000,amenities:["Parking","Outdoor","Catering"],rating:4.6,reviews:91,verified:true,type:"Garden"},
 {id:"venue-3",managerId:"venue-3",name:"Skyline Banquets",location:"Hyderabad",area:"Hitech City",description:"A contemporary banquet hall for modern celebrations.",capacity:350,pricePerEvent:100000,amenities:["AC","Parking","Stage"],rating:4.5,reviews:72,verified:true,type:"Banquet"}
];
