/**
 * Phone validation helpers for checkout (Nigeria-first, international-tolerant).
 */

/**
 * Normalize digits for comparison (strip spaces, dashes, parentheses).
 * @param {string} raw
 * @returns {string}
 */
export function normalizePhoneDigits(raw) {
  return String(raw || '').replace(/[^\d+]/g, '');
}

/**
 * Accept common NG formats: 080…, 234…, +234…, and optional international +E.164.
 * @param {string} raw
 * @returns {boolean}
 */
export function isValidCheckoutPhone(raw) {
  const s = String(raw || '').trim();
  if (!s) return false;

  const digits = s.replace(/\D/g, '');
  // Nigerian local: 11 digits starting with 0 (e.g. 08012345678)
  if (/^0[789]\d{9}$/.test(digits)) return true;
  // Nigerian with country code: 234 + 10 digits
  if (/^234[789]\d{9}$/.test(digits)) return true;
  // E.164-ish international: 10–15 digits total (without +)
  if (digits.length >= 10 && digits.length <= 15 && !/^0+$/.test(digits)) {
    // Prefer requiring leading + for non-NG long numbers
    if (s.startsWith('+') || digits.startsWith('234')) return true;
  }
  return false;
}
