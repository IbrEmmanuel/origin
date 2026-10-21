# Fix login blocked by Imunify360

## What is happening

`api.originelectricltd.com` is protected by **Imunify360 bot-protection**.

| How the app calls the API | Result |
|---------------------------|--------|
| Through Vite / Vercel proxy (server/Node) | **403** — Imunify treats it as automation |
| Directly from the browser | Needs **CORS** headers on the API |

The frontend is configured for **browser-direct** calls (`VITE_API_URL=https://api.originelectricltd.com/api`). Proxies were removed so we do not look like a bot.

## What you must do on the host (cPanel / WHM / Cloudflare)

### 1. Imunify360

1. Open **Imunify360** → **Firewall** / **Bot-Protection**.
2. Either:
   - **Whitelist** your office/home IP(s), and any CI IPs you use, **or**
   - **Disable bot-protection** for the API vhost / paths:
     - `/api/auth/*`
     - preferably all of `/api/*` used by the webapp
3. Save and wait 1–2 minutes.

### 2. CORS on the API

The API must send headers on **success and error** responses (including OPTIONS preflight):

```
Access-Control-Allow-Origin: https://www.originelectricltd.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With
Access-Control-Allow-Credentials: true   # only if you use cookies
```

For local development, also allow:

```
Access-Control-Allow-Origin: http://localhost:5173
```

(or echo the request `Origin` when it matches an allowlist).

If you use **Cloudflare** in front of the API, add the same CORS headers there (Transform Rule / Worker) so challenge/403 pages are not missing `Access-Control-Allow-Origin`.

### 3. Confirm

```bash
curl -i -X OPTIONS "https://api.originelectricltd.com/api/auth/login" \
  -H "Origin: https://www.originelectricltd.com" \
  -H "Access-Control-Request-Method: POST"
```

You should see `204`/`200` and `Access-Control-Allow-Origin`.

Then try login again from the site.

## Frontend config (already set)

```
VITE_API_URL=https://api.originelectricltd.com/api
VITE_API_BASE_URL=https://api.originelectricltd.com
```

Do **not** set `VITE_API_URL=/api` unless the API host has whitelisted your proxy and CORS is unnecessary.
