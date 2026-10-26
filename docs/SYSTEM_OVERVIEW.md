# System Overview — Origin Electric Platform

**Scope of this document:** Verified from the frontend repository (`Origin-Electric-Webapp-deploy` / `origin`). The business API and database are **external** and are described only at the integration boundary.

**Last verified:** 2026-10-26 · Baseline commit after foundation restructure.

## 1. What this platform is

Origin Electric is a Nigerian energy/security commerce site:

- Public marketing pages, marketplace, blog, load calculator
- Customer accounts (orders, profile, consultations)
- Vendor hub (catalog, bulk import, wallet/payouts, orders)
- Paystack payments (Inline + server verify)
- Sales chat via AgentOS (Fly)
- Google sign-in via Firebase Auth → backend `/auth/google`

## 2. High-level architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│  Vue 3 SPA (this repo)                                      │
│  src/views · src/components · src/composables               │
│  src/services/* (HTTP adapters) · src/config/env.js         │
└───────────────┬───────────────────────────┬─────────────────┘
                │                           │
                │ /api (proxy or direct)    │ Paystack CDN / Firebase
                ▼                           ▼
┌───────────────────────────┐    ┌──────────────────────────┐
│ api.originelectricltd.com │    │ External providers       │
│ Business API + media      │    │ Paystack · Firebase      │
│ Auth, orders, vendors,    │    │ Fly AgentOS (sales)      │
│ blog, wallet, verify-pay  │    └──────────────────────────┘
│ Database (NOT in SPA repo)│
└───────────────────────────┘
```

## 3. Responsibility split

| Concern | Owner | Location |
|---------|--------|----------|
| UI / routing / SEO | Frontend repo | `src/` |
| Browser config (public) | Frontend | `src/config/env.js`, `VITE_*` |
| HTTP adapters | Frontend | `src/services/` |
| Auth tokens (client) | Frontend | `localStorage` + axios interceptors |
| Business rules, DB, secrets | **API host** | Outside this repo |
| Paystack secret / webhooks | **API host** | Must never be `VITE_*` |
| Edge sales proxy | Frontend deploy | `api/agent.js` (Vercel) |

## 4. Hosting compatibility (Vercel)

| Workload | Fits Vercel? | Notes |
|----------|--------------|-------|
| Vue SPA static | Yes | Current `vercel.json` |
| API rewrite proxy | Yes (edge/proxy) | Imunify may block datacenter IPs — prefer browser→API CORS |
| Long-running jobs | No | Keep on API host / workers |
| Primary database | No | Keep on API host; never inside `dist/` |
| File/media | Partial | Media already on API origin `/uploads` |

**Recommendation:** Keep SPA on Vercel (or any static host). Keep API + DB + Paystack secrets on the existing API host. Do not move the database into this repository.

## 5. Environments

| Env | Frontend | API |
|-----|----------|-----|
| Local | `npm run dev` + `.env` | Proxy `/api` → production API (or staging if available) |
| Production | Vercel build with `VITE_*` | `api.originelectricltd.com` |

## 6. Related docs

- [WEBSITE_STRUCTURE.md](./WEBSITE_STRUCTURE.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [INTEGRATIONS.md](./INTEGRATIONS.md)
- [DATABASE_MIGRATION_PLAN.md](./DATABASE_MIGRATION_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
