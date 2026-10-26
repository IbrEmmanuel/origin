import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('config/env', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('strips /api from media origin', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.originelectricltd.com/api');
    vi.stubEnv('VITE_API_URL', '/api');
    const { env } = await import('@/config/env.js');
    expect(env.apiOrigin).toBe('https://api.originelectricltd.com');
    expect(env.apiUrl).toBe('/api');
  });

  it('reports paystackConfigured only for real keys', async () => {
    vi.stubEnv('VITE_PAYSTACK_PUBLIC_KEY', '');
    vi.resetModules();
    const { publicConfigSnapshot } = await import('@/config/env.js');
    expect(publicConfigSnapshot().paystackConfigured).toBe(false);
  });
});
