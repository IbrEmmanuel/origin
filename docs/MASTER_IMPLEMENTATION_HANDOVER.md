# Master implementation handover — Origin Electric

Date: 2026-10-26  
Repo: Vue 3 + Vite SPA (`www.originelectricltd.com` via Vercel)  
Business API / DB: **`api.originelectricltd.com` (not in this repository)**

## Phase 1 — Audit summary

Confirmed by [Marketplace audit](b58ea41f-707b-4030-a285-a914c23bb278): SPA-only repo; ship commission/webhooks/approval/payouts on the API first; SPA can mirror fields once endpoints exist. SPA follow-ups from that audit (CCTV/automation images, supplier nav, client 12% preview) are in the section below. Unit tests + production build were re-run successfully after those changes.

| Area | Finding |
|------|---------|
| Stack | Vue 3, Vite, npm, Vercel; Edge proxy only in `api/agent.js` |
| Database / migrations | **Not in this repo** — see `docs/DATABASE_MIGRATION_PLAN.md` |
| Auth | API JWT + Firebase Google; roles enforced by API (no admin route meta in SPA) |
| Paystack | SPA Inline (`usePaystack.js`) + `userService.verifyPayment`; **secret + webhooks must stay on API** |
| Vendor | `/vendor-apply`, vendor dashboard under `/account`, `vendor.service.js` (UI gate only) |
| Admin | No admin RBAC UI in SPA; needs `/admin/*` APIs before dashboard screens |
| Limitation | Authoritative commission, webhook idempotency, payouts, WhatsApp, schema **require API work** |

## Implemented in this SPA (this pass)

### Phase 2 — Images
- CCTV card → `cctv-pole.jpg` (installed security cameras).
- Smart Home & Automation card → `cctv-main.jpg` (gate automation / remote).
- Fire temporary extinguisher card removed from home grid in favor of automation.
- Sources documented in `docs/SERVICE_IMAGE_SOURCES.md`.

### Phase 3 — Paystack (client)
- Existing checkout still: create order → Paystack Inline → `verifyPayment(reference, orderId)`.
- Checkout copy clarifies channels and that bank transfer is pending until verified.
- **Not done here:** webhook HMAC verify, idempotent event store, admin payment dashboard (API).

### Phase 4 — Supplier visibility
- Header + mobile nav: **Are You a Supplier?** → `/vendor-apply`.
- Footer already had Become a Supplier.
- Home page mounts existing `SupplierCTA`.

### Phase 6 — 12% commission (client math + vendor UX)
- `src/lib/commission.js` — integer kobo math; customer = base + 12%.
- Unit test: ₦100,000 → ₦12,000 commission → ₦112,000 customer.
- Vendor product form: base price input + live breakdown; submits `base_price`, `commission_*`, and customer `price`.
- **API must** treat `base_price` as authoritative, ignore client `price` if mismatched, snapshot commission on order items.

## Not implemented (blocked on API / credentials)

| Spec phase | Blocker |
|------------|---------|
| 3 server verify / webhooks / admin payments | Secret key + webhook endpoint on API host |
| 4–5 approval enforcement, document private storage | API authZ + storage bucket |
| 6–9 authoritative commission, ledger, manual payouts | Schema + admin APIs |
| 7 multi-vendor suborders | Order model on API |
| 8 admin dashboard modules | Admin app or API-backed SPA screens |
| 10 WhatsApp | Provider credentials + templates |
| 12 DB migrations | API repository |
| 14 E2E payment / webhook tests | Live API test env |

## How to verify (SPA)

```bash
npm test
npm run build
npm run dev   # check /#services, /vendor-apply, /account vendor products, /checkout
```

## Env (SPA only)

See `.env.example`. Never put Paystack **secret** in `VITE_*`.

## Files touched this pass

- `src/data/homeServices.js`
- `src/components/home/HomeServicesSection.vue`
- `src/components/Header.vue`
- `src/views/HomeView.vue`
- `src/views/Account/VendorProducts.vue`
- `src/views/CheckoutView.vue`
- `src/lib/commission.js`
- `tests/unit/commission.test.js`
- `docs/SERVICE_IMAGE_SOURCES.md`
- `docs/MASTER_IMPLEMENTATION_HANDOVER.md`

## Definition of done vs master spec

The SPA now has corrected service imagery, supplier entry points, transparent 12% pricing UX, and clearer Paystack messaging.  
**Full marketplace DoD (server-verified payments, enforced vendor gates, ledger payouts, WhatsApp) is not complete until the API host implements the corresponding phases.**
