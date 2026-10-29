# Origin Electric — Webapp (Vue SPA). 

Storefront for [Origin Electric](https://www.originelectricltd.com).  
Business API and database live on **`api.originelectricltd.com`** (not in this repository).

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Set `VITE_PAYSTACK_PUBLIC_KEY` to a real `pk_test_…` key before testing checkout.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run build` | Production build (+ sitemap) |
| `npm test` | Unit tests (Vitest) |
| `npm run test:paystack` | Payment stack smoke probe |
| `npm run health` | Live dependency health check |

## Documentation

Start here: [`docs/SYSTEM_OVERVIEW.md`](docs/SYSTEM_OVERVIEW.md)

- [Architecture](docs/ARCHITECTURE.md)
- [Website structure](docs/WEBSITE_STRUCTURE.md)
- [Deployment](docs/DEPLOYMENT_GUIDE.md)
- [Integrations](docs/INTEGRATIONS.md)
- [Database migration plan](docs/DATABASE_MIGRATION_PLAN.md)
- [Phase 1 restructure notes](docs/RESTRUCTURE_PHASE1.md)

## Remotes

- `origin` → Ayocrypt/Origin-Electric-Webapp-deploy
- `ibr` → IbrEmmanuel/origin
