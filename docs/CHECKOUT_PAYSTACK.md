# Checkout & Paystack (SPA)

## Root causes of the screenshot issues

1. **`VITE_PAYSTACK_PUBLIC_KEY` missing or placeholder** on the deployed build → Inline Paystack cannot start; button correctly disabled.
2. **Delivery fee stuck on “Pin address…”** when map key missing / shipping API fails — UI had no quote/error state.
3. **Form incomplete** — no required street field; city placeholder biased to Lagos; weak mobile layout for summary rows.
4. **Raw orange “set VITE_…” copy** shown to all users — now customers see a soft notice; env instructions only in **dev diagnostics**.

## Frontend env

| Variable | Where | Purpose |
|----------|--------|---------|
| `VITE_PAYSTACK_PUBLIC_KEY` | Vercel + local `.env` | Paystack Inline (`pk_test_` / `pk_live_`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Optional | Checkout map + Places |
| `VITE_API_URL` / `VITE_API_BASE_URL` | Host | Order + shipping APIs |

Redeploy after changing any `VITE_*` value (Vite bakes them at build time).

## Backend env (API host — never in this SPA)

| Variable | Purpose |
|----------|---------|
| `PAYSTACK_SECRET_KEY` | Verify charges / webhooks |
| Webhook URL | Signed Paystack events → mark orders paid idempotently |

## SPA flow (implemented)

Cart validate → `POST /api/user/checkout` → Paystack Inline (`channels`: card, bank, ussd, bank_transfer, qr) → `POST /user/verify-payment` with reference + order id.

Bank transfers remain **pending** until server verification succeeds. Funds settle to Origin Electric’s Paystack merchant account.

See also `docs/MARKETPLACE_VENDOR_PAYMENTS.md`.

## Status

- Checkout UI / mobile / form / map fallback / fee states: **implemented in SPA**
- Live Paystack charge in production: **not verified** until a real `pk_test_`/`pk_live_` key is set on Vercel and a test payment is completed
