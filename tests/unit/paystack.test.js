import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('usePaystack amount helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_PAYSTACK_PUBLIC_KEY', 'pk_test_abcdefghijklmnopqrstuvwxyz');
  });

  it('toKobo converts naira to integer kobo', async () => {
    const { toKobo } = await import('@/composables/usePaystack.js');
    expect(toKobo(1500)).toBe(150000);
    expect(toKobo(19.99)).toBe(1999);
    expect(toKobo(0)).toBe(0);
    expect(toKobo(-5)).toBe(0);
    expect(toKobo('12.5')).toBe(1250);
  });

  it('rejects placeholder keys', async () => {
    vi.stubEnv('VITE_PAYSTACK_PUBLIC_KEY', 'pk_test_your_key_here');
    vi.resetModules();
    const { isPaystackConfigured, getPaystackPublicKey } = await import(
      '@/composables/usePaystack.js'
    );
    expect(isPaystackConfigured()).toBe(false);
    expect(getPaystackPublicKey()).toBe(null);
  });

  it('accepts formatted pk_test keys', async () => {
    vi.stubEnv('VITE_PAYSTACK_PUBLIC_KEY', 'pk_test_abcdefghijklmnopqrstuvwxyz');
    vi.resetModules();
    const { isPaystackConfigured, getPaystackPublicKey } = await import(
      '@/composables/usePaystack.js'
    );
    expect(isPaystackConfigured()).toBe(true);
    expect(getPaystackPublicKey()).toMatch(/^pk_test_/);
  });

  it('accepts formatted pk_live keys', async () => {
    vi.stubEnv('VITE_PAYSTACK_PUBLIC_KEY', 'pk_live_abcdefghijklmnopqrstuvwxyz123456');
    vi.resetModules();
    const { isPaystackConfigured, getPaystackPublicKey, isPaystackTestMode } = await import(
      '@/composables/usePaystack.js'
    );
    expect(isPaystackConfigured()).toBe(true);
    expect(getPaystackPublicKey()).toMatch(/^pk_live_/);
    expect(isPaystackTestMode()).toBe(false);
  });

  it('exposes card, bank, ussd, bank_transfer, and qr channels', async () => {
    const { PAYSTACK_CHANNELS, PAYSTACK_CHANNEL_LABELS } = await import(
      '@/composables/usePaystack.js'
    );
    expect(PAYSTACK_CHANNELS).toEqual(
      expect.arrayContaining(['card', 'bank', 'ussd', 'bank_transfer', 'qr'])
    );
    expect(PAYSTACK_CHANNEL_LABELS.card).toBe('Card');
    expect(PAYSTACK_CHANNEL_LABELS.bank_transfer).toBe('Bank transfer');
  });
});
