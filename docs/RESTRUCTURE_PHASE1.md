# Restructure Phase 1 — Foundation (completed)

**Goal:** Improve maintainability without stack replacement or UI rebuild.

## Files changed and why

| Path | Why |
|------|-----|
| `src/config/env.js` | Central browser-safe configuration |
| `src/lib/errors.js` | Shared API error messages |
| `src/lib/logger.js` | Dev/prod-safe logging without leaking tokens |
| `src/services/api.js` | Use `env` + shared errors/logger |
| `src/utils/mediaUrl.js` | Use `env.apiOrigin` |
| `src/composables/usePaystack.js` | Use shared key validation from config |
| `src/composables/useSeo.js` | Site URL from config |
| `src/services/salesAgent.service.js` | Agent URL/id from config |
| `src/firebase/config.js` | Allow `VITE_FIREBASE_*` overrides |
| `.env.example` | Document all public vars; warn on secrets |
| `.gitignore` | Ensure env + health artifacts ignored |
| `docs/*` | Ownership docs + architecture + DB plan |
| `tests/unit/*` | Prove paystack/media/env helpers |
| `vitest.config.js` | Unit test runner |
| `scripts/health-check.mjs` | Observability probe |
| `package.json` | `test`, `health` scripts + vitest |
| `README.md` | Setup pointers |

## Explicitly not done in this phase

- No mass move of `views/` folders (high churn, low value)
- No new backend/database in this repo
- No admin RBAC rewrite (needs API)
- No removal of Paystack/Firebase/Vercel
- No deletion of backup Vue files yet (listed as candidates)

## Tests run

See CI/local: `npm test`, `npm run test:paystack`, `npm run health`, `npm run build`.

## Next recommended phases

1. Obtain API repo → `DATABASE_SCHEMA.md`, authz audit, backups.
2. Decide browser-direct API vs Vercel proxy; tighten CORS.
3. Lock down `api/agent.js` (auth/rate limit).
4. Playwright: login → marketplace → checkout shell.
5. Remove confirmed-dead backup views after grep confirmation.
