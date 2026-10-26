import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/mediaUrl', () => ({
  mediaUrl: (p) => (p ? `https://cdn.example/${String(p).replace(/^\//, '')}` : '')
}));

vi.mock('@/config/env', () => ({
  env: {
    siteUrl: 'https://www.originelectricltd.com',
    apiUrl: '/api',
    apiOrigin: 'https://api.originelectricltd.com'
  }
}));

import {
  plainText,
  buildMetaDescription,
  productJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  absoluteUrl,
  SITE
} from '@/composables/useSeo';

describe('useSeo helpers', () => {
  it('plainText strips HTML and truncates', () => {
    expect(plainText('<p>Hello <b>world</b></p>')).toBe('Hello world');
    expect(plainText('a'.repeat(200), 20).endsWith('…')).toBe(true);
  });

  it('buildMetaDescription prefers primary content', () => {
    expect(buildMetaDescription('Primary desc', 'Fallback')).toBe('Primary desc');
    expect(buildMetaDescription('', 'Fallback text')).toBe('Fallback text');
  });

  it('absoluteUrl builds production canonicals', () => {
    expect(absoluteUrl('/marketplace')).toBe('https://www.originelectricltd.com/marketplace');
    expect(absoluteUrl('https://cdn.example/x.jpg')).toBe('https://cdn.example/x.jpg');
  });

  it('productJsonLd uses live offer data and omits fake ratings', () => {
    const ld = productJsonLd(
      {
        id: 7,
        name: 'Hybrid Inverter 5kVA',
        description: 'Grid-tied hybrid inverter',
        sku: 'INV-5',
        price: 450000,
        stock: 3,
        store_name: 'Origin Store',
        images: JSON.stringify(['/uploads/inv.jpg'])
      },
      '/product/7'
    );
    expect(ld['@type']).toBe('Product');
    expect(ld.offers.priceCurrency).toBe('NGN');
    expect(ld.offers.price).toBe('450000');
    expect(ld.offers.availability).toContain('InStock');
    expect(ld.aggregateRating).toBeUndefined();
  });

  it('productJsonLd includes AggregateRating only with real counts', () => {
    const ld = productJsonLd(
      { id: 1, name: 'Battery', price: 100, stock: 0, images: [] },
      '/product/1',
      { avgRating: 4.5, reviewCount: 2 }
    );
    expect(ld.offers.availability).toContain('OutOfStock');
    expect(ld.aggregateRating.ratingValue).toBe('4.5');
    expect(ld.aggregateRating.reviewCount).toBe('2');
  });

  it('articleJsonLd uses BlogPosting with publisher', () => {
    const ld = articleJsonLd(
      {
        title: 'How to size a solar inverter',
        excerpt: 'A practical guide for Nigerian homes.',
        slug: 'how-to-size-solar-inverter',
        created_at: '2026-01-01',
        updated_at: '2026-02-01'
      },
      '/blog/how-to-size-solar-inverter'
    );
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.headline).toContain('solar');
    expect(ld.publisher.name).toBe(SITE.name);
  });

  it('breadcrumbJsonLd builds ListItem positions', () => {
    const ld = breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' }
    ]);
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[1].position).toBe(2);
  });
});
