import { describe, it, expect } from 'vitest';
import {
  calculateMarketplacePricing,
  baseFromCustomerNaira,
  nairaToKobo,
  koboToNaira,
  DEFAULT_COMMISSION_RATE_BPS
} from '../../src/lib/commission.js';

describe('marketplace commission (12% on base)', () => {
  it('uses 1200 basis points as default', () => {
    expect(DEFAULT_COMMISSION_RATE_BPS).toBe(1200);
  });

  it('converts naira to integer kobo', () => {
    expect(nairaToKobo(100000)).toBe(10000000);
    expect(nairaToKobo('112000.50')).toBe(11200050);
  });

  it('converts kobo back to naira', () => {
    expect(koboToNaira(1200000)).toBe(12000);
  });

  it('produces ₦12,000 commission and ₦112,000 customer price from ₦100,000 base', () => {
    const p = calculateMarketplacePricing(100000);
    expect(p.baseKobo).toBe(10000000);
    expect(p.commissionKobo).toBe(1200000);
    expect(p.customerKobo).toBe(11200000);
    expect(p.baseNaira).toBe(100000);
    expect(p.commissionNaira).toBe(12000);
    expect(p.customerNaira).toBe(112000);
    expect(p.ratePercent).toBe(12);
  });

  it('does not use floating-point accumulation for money', () => {
    const p = calculateMarketplacePricing(99.99);
    expect(Number.isInteger(p.baseKobo)).toBe(true);
    expect(Number.isInteger(p.commissionKobo)).toBe(true);
    expect(Number.isInteger(p.customerKobo)).toBe(true);
    expect(p.customerKobo).toBe(p.baseKobo + p.commissionKobo);
  });

  it('reverses customer price back to base for ₦112,000 → ₦100,000', () => {
    expect(baseFromCustomerNaira(112000)).toBe(100000);
  });
});
