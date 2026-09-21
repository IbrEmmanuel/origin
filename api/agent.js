/**
 * Vercel Serverless Proxy — forwards requests to the AgentOS backend.
 * Fixes CORS: the browser calls /api/agent/* on Vercel (same origin),
 * Vercel forwards to the real agent server server-side (no CORS restriction).
 *
 * Usage:
 *   Frontend calls: /api/agent/agents/sales-agent/runs
 *   This proxy forwards to: AGENT_BASE_URL/agents/sales-agent/runs
 */

const AGENT_BASE = (process.env.VITE_SALES_AGENT_URL || 'https://agent.originelectricltd.com').replace(/\/$/, '');

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Extract the path after /api/agent
  const url = new URL(req.url);
  const pathAfterProxy = url.pathname.replace(/^\/api\/agent/, '') || '/';
  const targetUrl = `${AGENT_BASE}${pathAfterProxy}${url.search}`;

  // Copy headers — strip host
  const headers = new Headers();
  for (const [key, value] of req.headers.entries()) {
    if (!['host', 'connection', 'transfer-encoding'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  // Forward the request
  const proxyRes = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    // @ts-ignore
    duplex: 'half',
  });

  // Build response headers — add CORS
  const resHeaders = new Headers(proxyRes.headers);
  resHeaders.set('Access-Control-Allow-Origin', '*');
  resHeaders.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  resHeaders.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: resHeaders });
  }

  return new Response(proxyRes.body, {
    status: proxyRes.status,
    headers: resHeaders,
  });
}
