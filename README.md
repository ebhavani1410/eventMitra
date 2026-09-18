# EventMithra

EventMithra is a responsive event-coordination frontend. It takes a customer from an event brief through manager selection, venue quotation, proposal, booking, payment and review, while synchronizing state between demo roles.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` when connecting a backend. `VITE_API_URL` is the single API base URL configuration point.

## Demo accounts

All demo accounts use `Demo@123`.

| Role | Email |
| --- | --- |
| Customer | customer@eventmithra.com |
| Event manager | manager@eventmithra.com |
| Venue manager | venue@eventmithra.com |
| Admin | admin@eventmithra.com |

## Demo workflow

1. Sign in as Customer, create the prefilled birthday brief, then send a request to Ravi Events.
2. Sign in as Event Manager and accept the request. Open Venues and send an availability request to Grand Convention Hall.
3. Sign in as Venue Manager, respond to the inquiry with a quote.
4. Sign in as Event Manager, create and send a proposal.
5. Sign in as Customer, accept the proposal and pay the deposit from Bookings.
6. Switch to any role to see the synchronized notification / booking; submit a review from Customer.

Use **Reset demo data** in the role portal to start again.

## Architecture

- `src/App.tsx` contains the routed, role-protected product screens.
- `src/store/useStore.ts` is the centralized Zustand workflow store, persisted to localStorage.
- `src/types` contains shared domain models.
- `src/data/seed.ts` contains Hyderabad-focused demo data.
- `src/services/api.ts` is the API configuration boundary. Replace state mutations with Axios/Socket.IO-backed functions there when the backend exists.

The mock state is deliberately centralized so all role views see the same requests, inquiries, proposals, payments, messages and notifications after refresh. Backend authorization, payment processing, document verification, invoice downloads and realtime transport must be enforced server-side before production deployment.
