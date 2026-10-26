/**
 * Central browser-safe configuration.
 * Only VITE_* values are available here — never put server secrets in this file.
 */

const trim = (v) => (v == null ? '' : String(v).trim());

const DEFAULT_API_ORIGIN = 'https://api.originelectricltd.com';
const DEFAULT_SITE_URL = 'https://www.originelectricltd.com';
const DEFAULT_AGENT_URL = 'https://staging-ai-agent.fly.dev';

function apiOriginFromEnv() {
  let base = trim(import.meta.env.VITE_API_BASE_URL) || DEFAULT_API_ORIGIN;
  if (/localhost|127\.0\.0\.1/i.test(base)) base = DEFAULT_API_ORIGIN;
  base = base.replace(/\/$/, '');
  if (/\/api$/i.test(base)) base = base.replace(/\/api$/i, '');
  return base || DEFAULT_API_ORIGIN;
}

/** Public site + API endpoints the SPA may call. */
export const env = Object.freeze({
  /** Same-origin or absolute API prefix for axios (e.g. `/api`). */
  apiUrl: trim(import.meta.env.VITE_API_URL) || '/api',
  /** Absolute origin for media/uploads (no `/api` suffix). */
  apiOrigin: apiOriginFromEnv(),
  /** Canonical public site URL (SEO). */
  siteUrl: trim(import.meta.env.VITE_SITE_URL) || DEFAULT_SITE_URL,
  /** Paystack public key only (pk_test_ / pk_live_). */
  paystackPublicKey: trim(import.meta.env.VITE_PAYSTACK_PUBLIC_KEY),
  /** Optional Google Maps browser key. */
  googleMapsApiKey: trim(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
  /** Sales AgentOS base URL. */
  salesAgentUrl: (trim(import.meta.env.VITE_SALES_AGENT_URL) || DEFAULT_AGENT_URL).replace(
    /\/$/,
    ''
  ),
  salesAgentId: trim(import.meta.env.VITE_SALES_AGENT_ID) || 'sales-agent',
  bossWhatsapp: trim(import.meta.env.VITE_BOSS_WHATSAPP) || '',
  isDev: Boolean(import.meta.env.DEV),
  isProd: Boolean(import.meta.env.PROD),
  mode: import.meta.env.MODE || 'development'
});

export function isPaystackKeyConfigured(key = env.paystackPublicKey) {
  const k = trim(key);
  if (!k) return false;
  if (
    k === 'pk_test_placeholder' ||
    k === 'pk_test_your_key_here' ||
    k === 'undefined' ||
    k === 'null'
  ) {
    return false;
  }
  return /^pk_(test|live)_[A-Za-z0-9]+$/.test(k);
}

/** Non-secret snapshot for health / diagnostics UI. */
export function publicConfigSnapshot() {
  return {
    mode: env.mode,
    apiUrl: env.apiUrl,
    apiOrigin: env.apiOrigin,
    siteUrl: env.siteUrl,
    salesAgentConfigured: Boolean(env.salesAgentUrl),
    paystackConfigured: isPaystackKeyConfigured(),
    googleMapsConfigured: Boolean(env.googleMapsApiKey)
  };
}
