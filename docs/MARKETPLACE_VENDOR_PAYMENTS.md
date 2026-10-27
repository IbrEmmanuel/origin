# Marketplace, Paystack & vendor operations (SPA)

Maps product requirements → what this Vue SPA owns vs the Origin API / admin dashboard.

## 2. Paystack payment integration

| Requirement | SPA status | Notes |
|-------------|------------|--------|
| Card / bank / bank transfer / other | **Implemented** | `PAYSTACK_CHANNELS` in `src/composables/usePaystack.js` (`card`, `bank`, `ussd`, `bank_transfer`, `qr`). Checkout shows method chips. |
| Funds to Origin account | **Merchant config** | Paystack Inline charges the Origin Electric merchant (`VITE_PAYSTACK_PUBLIC_KEY`). Secret key + settlement bank stay on the API / Paystack dashboard. |
| Verify payment | **Implemented** | Checkout → `POST /user/verify-payment` with Paystack `reference` + `orderId`. |
| Reflect in admin | **API / admin** | After verify (+ Paystack webhook), admin order list must show paid status. SPA customer + vendor order UIs read that status. |

Env: `VITE_PAYSTACK_PUBLIC_KEY` (build-time). See `docs/CHECKOUT_PAYSTACK.md`.

## 3. Vendor registration & approval

| Requirement | SPA status | Notes |
|-------------|------------|--------|
| “Are You a Supplier?” | **Implemented** | Header + mobile nav + home `SupplierCTA` + footer “Become a Supplier” → `/vendor-apply`. |
| Create account + apply | **Implemented** | Logged-in user submits via `POST /vendor/apply`. |
| Store pics, address, geo, verification | **Implemented (SPA)** | Address fields + GPS pin + store photos + optional ID/CAC uploads (`VendorApplicationView.vue`). API must persist multipart fields. |
| Admin review / approval | **API / admin** | Applications appear in admin dashboard; SPA polls `GET /vendor/status`. |
| Only approved vendors sell | **Implemented** | Router `requiresVendorApproved`; “Go to Vendor Dashboard” only when `approved`. |

## 4. Vendor marketplace & 12% commission

| Requirement | SPA status | Notes |
|-------------|------------|--------|
| Upload products / images / prices | **Implemented** | Vendor Products hub (incl. bulk upload). |
| +12% on vendor base → customer price | **Implemented** | `src/lib/commission.js` — single product form **and** bulk CSV import (`rowToProductPayload`) send `base_price` + customer `price`. **API should recompute authoritatively.** |

Example: base ₦100,000 → commission ₦12,000 → customer ₦112,000.

## 5. Orders, notifications, vendor payments

| Requirement | SPA status | Notes |
|-------------|------------|--------|
| Payment into Origin account | **Paystack merchant** | Same as §2. |
| Notify admin + vendor | **Partial** | Vendor UI shows delivery + WhatsApp-to-customer. **Server-side WhatsApp/email/SMS to admin & vendor on paid order is API responsibility** (webhook after verify). |
| Vendor gets delivery details | **Implemented** | `VendorOrderDetails.vue` surfaces address / phone / map when API returns them. |
| Origin keeps 12%; vendor gets base | **Policy** | Vendor earnings UI uses line totals (base). Manual payouts via Vendor Wallet / admin until automation. |

## API checklist (backend owners)

1. Persist vendor apply multipart: `store_photos[]`, `id_document`, `cac_document`, `latitude`, `longitude`.
2. Paystack webhook → mark order paid → push WhatsApp/email to admin + assigned vendors.
3. Vendor order detail payload includes delivery street/city/state/phone (and lat/lng if collected).
4. Recompute commission server-side; never trust client-only customer price.
5. Admin payout queue for vendor base amounts (manual is OK for v1).
