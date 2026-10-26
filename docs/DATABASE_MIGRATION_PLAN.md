# Database migration plan

## Status: blocked on API repository

This frontend repository **does not contain**:

- Database connection strings
- ORM models
- SQL/NoSQL migration files
- Schema dumps

Persistence for users, orders, products, vendors, blog posts, and wallets lives on **`api.originelectricltd.com`** (confirmed by product APIs returning live data; schema not inspectable from SPA).

## What “migrations” mean for this platform

| Layer | Action | Owner |
|-------|--------|-------|
| SPA | No DB migrations | Frontend team |
| API | Versioned migrations (Flyway/Knex/Laravel/etc. — **TBD when repo available**) | Backend team |
| Data | Backup before any destructive change | Hosting / DBA |

## Plan once API access is granted

1. Inventory schema (tables/collections, FKs, indexes).
2. Document in `docs/DATABASE_SCHEMA.md` (required ownership doc).
3. Ensure migrations are in source control with up/down scripts.
4. Add staging DB restore drill; document in `BACKUP_AND_RECOVERY.md`.
5. Never run production migrations from the Vue deploy pipeline.

## Compatibility rule for frontend changes

Frontend restructures **must not** require DB changes. If a feature needs new columns/endpoints, ship API migration first, then SPA.

## Interim safeguards

- Treat all write APIs as authoritative.
- Soft-fail optional endpoints (bulk import 404 → client CRUD fallback already exists).
- No local SQLite/JSON “database” inside the SPA for production data.
