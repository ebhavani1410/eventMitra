export type UserRole = "customer" | "manager" | "venue" | "admin";
export type RequestStatus = "pending" | "accepted" | "rejected" | "quoted";
export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected" | "changes_requested";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "refunded";
export interface User { id: string; name: string; email: string; phone: string; role: UserRole; avatar?: string; city?: string; approved?: boolean }
export interface EventRequirement { id: string; customerId: string; eventType: string; eventName: string; date: string; startTime: string; endTime: string; guestCount: number; budget: number; location: string; area: string; services: string[]; preferences: string; requirements: string; status: "draft" | "requested" | "in_progress" | "proposal_sent" | "confirmed" | "completed" | "cancelled" }
export interface EventManager { id: string; userId: string; businessName: string; description: string; location: string; experience: number; rating: number; reviews: number; services: string[]; startingPrice: number; verified: boolean; categories: string[] }
export interface Venue { id: string; managerId: string; name: string; location: string; area: string; description: string; capacity: number; pricePerEvent: number; amenities: string[]; rating: number; reviews: number; verified: boolean; type: string }
export interface ManagerRequest { id: string; eventId: string; customerId: string; managerId: string; status: RequestStatus; createdAt: string }
export interface VenueInquiry { id: string; eventId: string; managerId: string; venueId: string; status: RequestStatus; message: string; quote?: number; createdAt: string }
export interface ProposalItem { id: string; name: string; description: string; quantity: number; price: number }
export interface Proposal { id: string; eventId: string; customerId: string; managerId: string; venueId: string; title: string; description: string; items: ProposalItem[]; totalAmount: number; status: ProposalStatus; expiry: string; createdAt: string }
export interface Booking { id: string; eventId: string; customerId: string; managerId: string; venueId: string; proposalId: string; amount: number; deposit: number; paymentStatus: PaymentStatus; bookingStatus: "pending" | "confirmed" | "completed" | "cancelled"; createdAt: string }
export interface Message { id: string; senderId: string; receiverId: string; text: string; createdAt: string; read: boolean }
export interface Notification { id: string; userId: string; title: string; message: string; type: string; read: boolean; createdAt: string }
export interface Review { id: string; bookingId: string; customerId: string; targetId: string; rating: number; comment: string; createdAt: string }
