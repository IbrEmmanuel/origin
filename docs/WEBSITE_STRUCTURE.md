# Website structure

## Directory map (frontend repo)

```text
.
├── api/agent.js              # Vercel Edge sales-agent proxy
├── docs/                     # Internal ownership docs
├── public/                   # robots.txt, sitemap.xml, llms.txt, static assets
├── scripts/                  # sitemap, health-check, paystack smoke
├── src/
│   ├── config/env.js         # Central VITE_* config
│   ├── lib/                  # errors, logger
│   ├── services/             # API & integration adapters
│   ├── composables/          # useCart, usePaystack, useSeo, useTheme
│   ├── components/           # Shared UI
│   ├── views/                # Pages (incl. Account/* vendor hub)
│   ├── router/index.js
│   ├── utils/
│   ├── firebase/
│   ├── assets/global.css
│   ├── App.vue
│   └── main.js
├── tests/unit/               # Vitest unit tests
├── .env.example
├── package.json
├── vercel.json
└── vite.config.js
```

## Public routes

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/marketplace`, `/product/:id` | Shop |
| `/cart`, `/checkout`, `/order-success` | Cart & Paystack checkout |
| `/blog`, `/blog/:slug` | Content |
| `/about`, `/services`, `/projects`, `/contact` | Marketing |
| `/load-audit` | Calculator |
| `/login`, `/signup`, `/forgot-password`, `/verify-email` | Auth |
| `/account/*` | Buyer + vendor hub |
| `/vendor-apply` | Vendor onboarding |
| `/sales-chat`, `/origin-talk` | AI surfaces |

Private routes set `noindex` via `useSeo`.

## Services inventory

| File | Domain |
|------|--------|
| `api.js` | Axios client, auth header, session expiry |
| `auth.service.js` | Register/login/google/verify/reset |
| `user.service.js` | Profile, orders, verify-payment, referrals |
| `marketplace.service.js` | Catalog, cart validation |
| `vendor.service.js` | Vendor CRUD, wallet, payout, bulk import |
| `consultationService.js` | Bookings + payment verify |
| `blog.service.js` | Posts/categories |
| `salesAgent.service.js` | AgentOS SSE chat |
| `ai.service.js` | Origin Talk |
| `contact.service.js` | Contact form |
| `appliance.service.js`, `settings.service.js` | Load audit support |

## Cleanup notes

- Home backups / stub `Home.vue`, unused `SalesChatFAB`, and unused `ads.service.js` removed.
- Catalog listing normalized via `normalizeProductsResponse` / `normalizeCategories` in `marketplace.service.js`.
- Contact + checkout go through shared `api.js` (same `/api` proxy as marketplace).
