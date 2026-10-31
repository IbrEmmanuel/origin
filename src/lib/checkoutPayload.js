/** Strip null coords / empty postal so API validators don't 500. */
export function sanitizeCheckoutPayload(raw = {}) {
  const items = (raw.items || []).map((item) => ({
    id: Number(item.id),
    quantity: Math.max(1, Number(item.quantity) || 1)
  }));

  const payload = {
    items,
    delivery_street: String(raw.delivery_street || '').trim(),
    delivery_city: String(raw.delivery_city || '').trim(),
    delivery_state: String(raw.delivery_state || '').trim(),
    delivery_country: String(raw.delivery_country || 'Nigeria').trim() || 'Nigeria',
    contact_phone: String(raw.contact_phone || '').trim(),
    delivery_fee: Number(raw.delivery_fee)
  };

  if (!Number.isFinite(payload.delivery_fee) || payload.delivery_fee < 0) {
    payload.delivery_fee = 0;
  }

  const postal = String(raw.delivery_postal_code || raw.postalCode || '').trim();
  if (postal) payload.delivery_postal_code = postal;

  const lat = raw.latitude != null ? Number(raw.latitude) : null;
  const lng = raw.longitude != null ? Number(raw.longitude) : null;
  if (lat != null && Number.isFinite(lat)) payload.latitude = lat;
  if (lng != null && Number.isFinite(lng)) payload.longitude = lng;

  return payload;
}
