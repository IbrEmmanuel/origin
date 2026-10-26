# Architecture diagram & boundaries

## Current deployment topology

```text
                    DNS
     originelectric.com ──► lander redirect (separate from Vue)
www.originelectricltd.com ──► Vercel (Vue dist + optional /api rewrite)
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             Static assets    /api/* rewrite    /api/agent Edge
             (HTML/JS/CSS)    to API host       → Fly AgentOS
                                    │
                                    ▼
                     api.originelectricltd.com
                     ┌─────────────────────┐
                     │ Auth · Orders ·     │
                     │ Marketplace · Blog  │
                     │ Vendor · Wallet     │
                     │ Payment verify      │
                     │ Media /uploads      │
                     │ [Database]          │
                     └─────────────────────┘
```

## Frontend module boundaries (this repo)

```text
src/
  config/          # Browser-safe env (VITE_* only)
  lib/             # Cross-cutting: errors, logger
  services/        # Integration adapters (HTTP) — no UI
  composables/     # Vue reusable state/helpers
  utils/           # Pure helpers (mediaUrl, import)
  components/      # Presentational / shared UI
  views/           # Route-level pages
  router/          # Routes + guards + SEO hooks
  firebase/        # Google auth bootstrap
  assets/          # Global CSS / static design tokens
api/
  agent.js         # Vercel Edge — sales agent CORS proxy only
```

**Rule:** Views call `services/*` or `composables/*`. Views must not embed raw `fetch` to new domains without an adapter (legacy Checkout uses `fetch` via `apiUrl` helper — prefer `user.service` for new work).

## Integration adapter pattern

Each external system has one service module:

| System | Adapter | Failure behavior |
|--------|---------|------------------|
| Business API | `services/api.js` + domain services | Axios errors → `lib/errors.js` messages; 401 clears session |
| Paystack Inline | `composables/usePaystack.js` | Throws if public key missing; verify on API |
| AgentOS | `services/salesAgent.service.js` | Chat UX errors; commerce must not depend on agent |
| Firebase | `firebase/config.js` | Google button fails closed if init fails |
| Media | `utils/mediaUrl.js` | Empty string if path invalid |

## What is intentionally not in this repo

- Database schemas / migrations (API ownership)
- Paystack secret key
- Admin RBAC enforcement (must be API-enforced)
- Background job runners

See [DATABASE_MIGRATION_PLAN.md](./DATABASE_MIGRATION_PLAN.md).
