/**
 * Vercel Edge Proxy for Origin Sales Agent.
 *
 * The agent server (Cloudflare) only allows:
 *   access-control-allow-origin: https://originelectricltd.com
 *
 * This proxy spoof the Origin header so the agent accepts it,
 * then passes the response back to the browser with wildcard CORS
 * so Vercel / localhost can receive it.
 */

const fromEnv = String(process.env.VITE_SALES_AGENT_URL || '').replace(/\/$/, '');
const AGENT_BASE = fromEnv.includes('fly.dev') ? fromEnv : 'https://staging-ai-agent.fly.dev';
const ALLOWED_ORIGIN = 'https://originelectricltd.com';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);

  // Strip /api/agent prefix to get the real path
  const agentPath = url.pathname.replace(/^\/api\/agent/, '') || '/';
  const targetUrl = `${AGENT_BASE}${agentPath}${url.search}`;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(req),
    });
  }

  // Build forwarded headers — spoof Origin so Cloudflare allows it
  const forward = new Headers();
  for (const [k, v] of req.headers.entries()) {
    const lower = k.toLowerCase();
    if (['host', 'connection', 'transfer-encoding'].includes(lower)) continue;
    forward.set(k, v);
  }
  // Override Origin to the one the agent trusts
  forward.set('origin', ALLOWED_ORIGIN);
  forward.set('referer', `${ALLOWED_ORIGIN}/`);

  // Forward the request
  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers: forward,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    // @ts-ignore  (required for streaming in edge runtime)
    duplex: 'half',
  });

  // Replace upstream CORS headers with permissive ones for our frontend
  const resHeaders = new Headers();
  for (const [k, v] of upstream.headers.entries()) {
    const lower = k.toLowerCase();
    // Drop upstream CORS headers — we replace them below
    if (lower.startsWith('access-control-')) continue;
    resHeaders.set(k, v);
  }
  // Add permissive CORS so any Vercel/localhost frontend can read the stream
  const ch = corsHeaders(req);
  for (const [k, v] of ch.entries()) resHeaders.set(k, v);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

function corsHeaders(req) {
  const requestOrigin = req.headers.get('origin') || '*';
  return new Headers({
    'Access-Control-Allow-Origin': requestOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,Accept,X-Requested-With',
    'Access-Control-Expose-Headers': '*',
  });
}
