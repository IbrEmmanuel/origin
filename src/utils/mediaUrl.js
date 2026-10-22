const API_ORIGIN = 'https://api.originelectricltd.com';

/** Resolve product/upload paths against the live API host (never localhost). */
export function mediaUrl(path) {
  if (!path) return '';
  const value = String(path).trim();
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }
  const base = (import.meta.env.VITE_API_BASE_URL || API_ORIGIN).replace(/\/$/, '');
  return `${base}${value.startsWith('/') ? value : `/${value}`}`;
}

export function firstMediaUrl(images) {
  try {
    const list = typeof images === 'string' ? JSON.parse(images) : images;
    const first = Array.isArray(list) ? list[0] : list;
    return mediaUrl(first);
  } catch {
    return mediaUrl(images);
  }
}
