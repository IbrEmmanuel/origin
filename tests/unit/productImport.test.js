import { describe, it, expect } from 'vitest';
import { rowToProductPayload } from '@/utils/productImport.js';

describe('rowToProductPayload commission', () => {
  it('adds 12% marketplace commission on top of CSV base price', () => {
    const payload = rowToProductPayload({
      sku: 'SKU-001',
      name: 'Hybrid Inverter',
      description: 'Test',
      price: 100000,
      stock: 3,
      category: 'solar',
      image_url: ''
    });

    expect(payload.base_price).toBe(100000);
    expect(payload.commission_amount).toBe(12000);
    expect(payload.price).toBe(112000);
    expect(payload.commission_rate_bps).toBe(1200);
  });
});
