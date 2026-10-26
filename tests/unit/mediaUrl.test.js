import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('mediaUrl', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.originelectricltd.com');
  });

  it('resolves relative upload paths against API origin', async () => {
    const { mediaUrl } = await import('@/utils/mediaUrl.js');
    expect(mediaUrl('/uploads/a.jpg')).toBe(
      'https://api.originelectricltd.com/uploads/a.jpg'
    );
  });

  it('keeps absolute https URLs', async () => {
    const { mediaUrl } = await import('@/utils/mediaUrl.js');
    expect(mediaUrl('https://cdn.example.com/x.png')).toBe(
      'https://cdn.example.com/x.png'
    );
  });

  it('rewrites localhost absolute URLs to API origin', async () => {
    const { mediaUrl } = await import('@/utils/mediaUrl.js');
    expect(mediaUrl('http://localhost:5173/uploads/x.jpg')).toBe(
      'https://api.originelectricltd.com/uploads/x.jpg'
    );
  });

  it('parses JSON image arrays', async () => {
    const { parseProductImages, resolveProductImages } = await import(
      '@/utils/mediaUrl.js'
    );
    const paths = parseProductImages('["/uploads/a.jpg","/uploads/b.jpg"]');
    expect(paths).toEqual(['/uploads/a.jpg', '/uploads/b.jpg']);
    const urls = resolveProductImages(paths);
    expect(urls[0]).toContain('api.originelectricltd.com');
  });
});
