/**
 * Marketplace commission math — integer kobo only (never float money).
 *
 * Policy: commission is added ON TOP of vendor base price.
 *   B = vendor base (naira)
 *   rate = 12% default
 *   commission = B × 0.12
 *   customerPrice = B + commission
 *
 * Authoritative totals must still be recalculated on the API.
 * This module is for vendor UX previews and client-side consistency checks.
 */

/** Default Origin Electric marketplace commission: 12% = 1200 basis points */
export const DEFAULT_COMMISSION_RATE_BPS = 1200;

/**
 * @param {number|string} amountNaira
 * @returns {number} integer kobo
 */
export function nairaToKobo(amountNaira) {
  const n = Number(amountNaira);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

/**
 * @param {number} kobo
 * @returns {number} naira (may include 2dp)
 */
export function koboToNaira(kobo) {
  const k = Number(kobo);
  if (!Number.isFinite(k)) return 0;
  return k / 100;
}

/**
 * Format naira for Nigerian display (no currency symbol).
 * @param {number|string} amountNaira
 */
export function formatNaira(amountNaira) {
  const n = Number(amountNaira);
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

/**
 * @param {number|string} baseNaira - vendor base selling price
 * @param {number} [rateBps=DEFAULT_COMMISSION_RATE_BPS]
 * @returns {{
 *   baseKobo: number,
 *   commissionKobo: number,
 *   customerKobo: number,
 *   baseNaira: number,
 *   commissionNaira: number,
 *   customerNaira: number,
 *   rateBps: number,
 *   ratePercent: number
 * }}
 */
export function calculateMarketplacePricing(
  baseNaira,
  rateBps = DEFAULT_COMMISSION_RATE_BPS
) {
  const rate = Number.isFinite(Number(rateBps)) ? Math.max(0, Math.trunc(Number(rateBps))) : DEFAULT_COMMISSION_RATE_BPS;
  const baseKobo = nairaToKobo(baseNaira);
  // Integer commission: round half-up on (base * bps / 10000)
  const commissionKobo = Math.round((baseKobo * rate) / 10000);
  const customerKobo = baseKobo + commissionKobo;

  return {
    baseKobo,
    commissionKobo,
    customerKobo,
    baseNaira: koboToNaira(baseKobo),
    commissionNaira: koboToNaira(commissionKobo),
    customerNaira: koboToNaira(customerKobo),
    rateBps: rate,
    ratePercent: rate / 100
  };
}

/**
 * Reverse customer-facing price → approximate vendor base when API only stores `price`.
 * Prefer reading `base_price` from the API when available.
 */
export function baseFromCustomerNaira(
  customerNaira,
  rateBps = DEFAULT_COMMISSION_RATE_BPS
) {
  const rate = Number.isFinite(Number(rateBps)) ? Math.max(0, Math.trunc(Number(rateBps))) : DEFAULT_COMMISSION_RATE_BPS;
  const customerKobo = nairaToKobo(customerNaira);
  if (rate === 0) return koboToNaira(customerKobo);
  const baseKobo = Math.round((customerKobo * 10000) / (10000 + rate));
  return koboToNaira(baseKobo);
}
