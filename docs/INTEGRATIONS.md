# Integrations

## Summary

| Integration | Purpose | Owner account | In SPA? | Replaceable? |
|-------------|---------|---------------|---------|--------------|
| Business API | Core commerce/auth | API host | Client only | N/A (core) |
| Paystack | Payments | Paystack dashboard | Public key + Inline | Other NG gateways with adapter rewrite |
| Firebase Auth | Google login | Firebase console | Web config | Email/password already via API |
| Fly AgentOS | Sales chat | Fly.io | Client SSE | Optional; feature-flaggable |
| Google Maps | Checkout map | Google Cloud | Optional browser key | Manual address entry |
| Vercel | SPA hosting | Vercel | Deploy | Any static host |

## Paystack

- **SPA:** `VITE_PAYSTACK_PUBLIC_KEY`, `src/composables/usePaystack.js`
- **API (required):** secret key, `POST /user/verify-payment`, consultation verify
- **Failure:** SPA blocks popup if key missing; after pay, verify failure shows support message
- **Health:** `npm run test:paystack`

## Firebase

- Env overrides: `VITE_FIREBASE_*` (optional)
- Restrict API key by HTTP referrer in Google Cloud / Firebase Console

## AgentOS

- `VITE_SALES_AGENT_URL`, `VITE_SALES_AGENT_ID`
- Edge proxy `api/agent.js` still exists; client currently prefers Fly URL when `fly.dev`
- **Failure:** chat unavailable; marketplace/checkout unaffected

## Business API

- Base: `VITE_API_URL` (axios) + `VITE_API_BASE_URL` (media)
- Known friction: Imunify360 bot protection vs Vercel proxy IPs — see `docs/IMUNIFY360_LOGIN_FIX.md`

## Cost notes (provisional)

Confirm live invoices. Typical: Vercel plan + API hosting + domain + Paystack fees (% per txn) + Fly AgentOS + Firebase (usually free tier for Auth).
