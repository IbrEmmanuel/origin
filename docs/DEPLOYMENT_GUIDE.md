# Deployment guide (frontend)

## Prerequisites

- Node.js 20+ recommended
- Access to GitHub remotes and Vercel project
- API host already running at `https://api.originelectricltd.com`
- Paystack **public** key for build-time inject

## Local setup

```bash
cp .env.example .env
# Edit .env — set VITE_PAYSTACK_PUBLIC_KEY to a real pk_test_… key
npm install
npm run dev
```

Open `http://localhost:5173`. API calls go to `/api` → Vite proxy → production API.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local SPA |
| `npm run build` | Sitemap generation + Vite production build |
| `npm run preview` | Preview `dist/` |
| `npm test` | Vitest unit tests |
| `npm run test:paystack` | Paystack/API smoke (no card charge) |
| `npm run health` | Live dependency health probes |

## Vercel production

1. Connect repo (Ayocrypt deploy or Ibr mirror).
2. Framework: Vite · Output: `dist` · Build: `npm run build`.
3. Set environment variables (Production):

   - `VITE_API_URL=/api` **or** absolute API URL if using browser-direct
   - `VITE_API_BASE_URL=https://api.originelectricltd.com`
   - `VITE_PAYSTACK_PUBLIC_KEY=pk_live_…` (or `pk_test_…`)
   - `VITE_SITE_URL=https://www.originelectricltd.com`
   - Agent vars as needed

4. Redeploy after any `VITE_*` change (they are baked at build time).
5. Verify: `npm run health` and a test checkout in Paystack test mode.

## Rollback

- Vercel → Deployments → Promote previous successful deployment.
- Or `git revert` + push `main`.

## Alternate static hosts

`public/_redirects` (Netlify) and `public/.htaccess` (Apache) support SPA fallbacks. Point DNS at the host serving `dist/`.

## Secrets policy

- Never set `PAYSTACK_SECRET_KEY`, DB URLs, or JWT secrets as `VITE_*`.
- Never commit `.env`. Use `.env.example` only.
