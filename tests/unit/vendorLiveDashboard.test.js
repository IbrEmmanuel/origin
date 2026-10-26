import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

import api from '@/services/api';
import vendorService from '@/services/vendor.service';

describe('vendorService.getLiveDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses dashboard-stats when the API returns live metrics', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        total_products: 4,
        total_orders: 2,
        total_sales: 150000,
        recent_activity: [{ id: 9, product_name: 'Inverter', qty: 1, price: 150000, status: 'paid' }]
      }
    });

    const dash = await vendorService.getLiveDashboard();
    expect(dash.source).toBe('dashboard-stats');
    expect(dash.totalProducts).toBe(4);
    expect(dash.totalOrders).toBe(2);
    expect(dash.totalSales).toBe(150000);
    expect(dash.recentActivity).toHaveLength(1);
  });

  it('composes from products, orders, and wallet when stats are empty', async () => {
    api.get
      .mockResolvedValueOnce({ data: {} }) // dashboard-stats
      .mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] }) // products
      .mockResolvedValueOnce({
        data: [
          { id: 10, vendor_total: 50000, items_count: 1, status: 'processing', created_at: '2026-01-02' },
          { id: 11, vendor_total: 25000, items_count: 2, status: 'shipped', created_at: '2026-01-01' }
        ]
      }) // orders
      .mockResolvedValueOnce({ data: { available_balance: 12000 } }); // wallet

    const dash = await vendorService.getLiveDashboard();
    expect(dash.source).toBe('composed');
    expect(dash.totalProducts).toBe(2);
    expect(dash.totalOrders).toBe(2);
    expect(dash.totalSales).toBe(75000);
    expect(dash.walletBalance).toBe(12000);
    expect(dash.recentActivity[0].id).toBe(10);
  });
});
