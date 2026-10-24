const API_ORIGIN = 'https://api.originelectricltd.com';

/** Media host only — never append /api (uploads live at origin root). */
function mediaBase() {
  let base = (import.meta.env.VITE_API_BASE_URL || API_ORIGIN).trim();
  if (!base || /localhost|127\.0\.0\.1/i.test(base)) base = API_ORIGIN;
  base = base.replace(/\/$/, '');
  // Guard against misconfigured .../api base breaking /uploads/*
  if (/\/api$/i.test(base)) base = base.replace(/\/api$/i, '');
  return base || API_ORIGIN;
}

/** Resolve product/upload paths against the live API host (never localhost). */
export function mediaUrl(path) {
  if (path == null || path === '') return '';
  if (typeof path === 'object') {
    const nested = path.url || path.src || path.path || path.image || path.href || '';
    return mediaUrl(nested);
  }
  let value = String(path).trim().replace(/^["']|["']$/g, '');
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    // Rewrite accidental localhost absolute URLs to production host
    try {
      const u = new URL(value);
      if (/localhost|127\.0\.0\.1/i.test(u.hostname)) {
        return `${mediaBase()}${u.pathname}${u.search}`;
      }
    } catch { /* keep original */ }
    return value;
  }
  if (!value.startsWith('/')) value = `/${value}`;
  return `${mediaBase()}${value}`;
}

/** Normalize API `images` field into a clean string path list. */
export function parseProductImages(images) {
  if (images == null || images === '') return [];

  let list = images;
  if (typeof list === 'string') {
    const trimmed = list.trim();
    if (!trimmed || trimmed === '[]' || trimmed === 'null') return [];
    try {
      list = JSON.parse(trimmed);
      // Handle double-encoded JSON strings
      if (typeof list === 'string') {
        try { list = JSON.parse(list); } catch { list = [list]; }
      }
    } catch {
      // Single path string
      return trimmed ? [trimmed] : [];
    }
  }

  if (!Array.isArray(list)) {
    if (typeof list === 'object') {
      const one = list.url || list.src || list.path || list.image;
      return one ? [one] : [];
    }
    return [];
  }

  return list
    .map((item) => {
      if (item == null) return '';
      if (typeof item === 'string') return item.trim();
      if (typeof item === 'object') return item.url || item.src || item.path || item.image || '';
      return String(item);
    })
    .filter(Boolean);
}

/** Full absolute URLs for every product image. */
export function resolveProductImages(images) {
  return parseProductImages(images).map((p) => mediaUrl(p)).filter(Boolean);
}

export function firstMediaUrl(images) {
  const urls = resolveProductImages(images);
  if (urls.length) return urls[0];
  return mediaUrl(typeof images === 'string' && !images.trim().startsWith('[') ? images : '');
}
