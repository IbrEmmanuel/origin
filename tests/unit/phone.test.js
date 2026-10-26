import { describe, it, expect } from 'vitest';
import { isValidCheckoutPhone, normalizePhoneDigits } from '../../src/lib/phone.js';

describe('checkout phone validation', () => {
  it('accepts common Nigerian formats', () => {
    expect(isValidCheckoutPhone('08012345678')).toBe(true);
    expect(isValidCheckoutPhone('07041880339')).toBe(true);
    expect(isValidCheckoutPhone('+2348012345678')).toBe(true);
    expect(isValidCheckoutPhone('2348012345678')).toBe(true);
    expect(isValidCheckoutPhone('0801 234 5678')).toBe(true);
  });

  it('rejects empty and too-short values', () => {
    expect(isValidCheckoutPhone('')).toBe(false);
    expect(isValidCheckoutPhone('08012')).toBe(false);
    expect(isValidCheckoutPhone('abcdefghijk')).toBe(false);
  });

  it('normalizes to digits and plus', () => {
    expect(normalizePhoneDigits('+234 801-234-5678')).toBe('+2348012345678');
  });
});
