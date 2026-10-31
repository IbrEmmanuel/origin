import { describe, it, expect } from 'vitest';
import { sanitizeCheckoutPayload } from '@/services/user.service.js';

describe('sanitizeCheckoutPayload', () => {
  it('omits null coords and empty postal, coerces numbers', () => {
    const out = sanitizeCheckoutPayload({
      items: [{ id: '42', quantity: '2' }],
      delivery_street: ' 12 Ring Rd ',
      delivery_city: 'Ibadan',
      delivery_state: 'Oyo',
      delivery_country: '',
      contact_phone: '08012345678',
      delivery_postal_code: '  ',
      latitude: null,
      longitude: undefined,
      delivery_fee: '1500'
    });

    expect(out.items).toEqual([{ id: 42, quantity: 2 }]);
    expect(out.delivery_street).toBe('12 Ring Rd');
    expect(out.delivery_country).toBe('Nigeria');
    expect(out.delivery_fee).toBe(1500);
    expect(out).not.toHaveProperty('delivery_postal_code');
    expect(out).not.toHaveProperty('latitude');
    expect(out).not.toHaveProperty('longitude');
  });

  it('keeps finite coordinates', () => {
    const out = sanitizeCheckoutPayload({
      items: [{ id: 1, quantity: 1 }],
      delivery_street: 'A',
      delivery_city: 'B',
      delivery_state: 'C',
      contact_phone: '0801',
      delivery_fee: 0,
      latitude: 7.4,
      longitude: 3.9
    });
    expect(out.latitude).toBe(7.4);
    expect(out.longitude).toBe(3.9);
    expect(out.delivery_fee).toBe(0);
  });
});
