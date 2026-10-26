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
});
