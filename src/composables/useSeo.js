import { mediaUrl } from '@/utils/mediaUrl';

const SITE = {
  name: 'Origin Electric',
  url: 'https://originelectric.com',
  defaultImage: 'https://originelectric.com/logo.png',
  twitter: '@originelectric'
};

function ensureMeta(selector, attrs) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.property || attrs.name?.startsWith('og:') ? 'meta' : 'meta');
    if (attrs.name) el.setAttribute('name', attrs.name);
    if (attrs.property) el.setAttribute('property', attrs.property);
    document.head.appendChild(el);
  }
  if (attrs.content != null) el.setAttribute('content', attrs.content);
  return el;
}

function setOrCreate(attr, key, content) {
  const selector =
    attr === 'property' ? `meta[property="${key}"]` : `meta[name="${key}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content ?? '');
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(id, data) {
  const scriptId = `jsonld-${id}`;
  let el = document.getElementById(scriptId);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = scriptId;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE.defaultImage;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE.url}${path}`;
}

/**
 * Apply page SEO for Google indexing + social previews.
 * @param {object} opts
 */
export function applySeo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
  jsonLdId = 'page'
} = {}) {
  const fullTitle = title
    ? title.includes(SITE.name)
      ? title
      : `${title} | ${SITE.name}`
    : `${SITE.name} | Smart Energy & Security Solutions`;

  const desc =
    description ||
    'Origin Electric — solar, inverters, CCTV, and engineering for homes and industry in Nigeria.';

  const url = absoluteUrl(path || window.location.pathname);
  const img = absoluteUrl(image || SITE.defaultImage);

  document.title = fullTitle;

  setOrCreate('name', 'description', desc.slice(0, 160));
  setOrCreate('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  setOrCreate('name', 'googlebot', noindex ? 'noindex, nofollow' : 'index, follow');

  setOrCreate('property', 'og:type', type);
  setOrCreate('property', 'og:site_name', SITE.name);
  setOrCreate('property', 'og:title', fullTitle);
  setOrCreate('property', 'og:description', desc.slice(0, 200));
  setOrCreate('property', 'og:url', url);
  setOrCreate('property', 'og:image', img);

  setOrCreate('name', 'twitter:card', 'summary_large_image');
  setOrCreate('name', 'twitter:title', fullTitle);
  setOrCreate('name', 'twitter:description', desc.slice(0, 200));
  setOrCreate('name', 'twitter:image', img);
  setOrCreate('name', 'twitter:url', url);

  setCanonical(url);
  setJsonLd(jsonLdId, jsonLd);
}

export function productJsonLd(product, path) {
  if (!product) return null;
  let images = [];
  try {
    const raw = product.images;
    const arr = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw || [];
    images = (Array.isArray(arr) ? arr : []).map((img) => mediaUrl(img)).filter(Boolean);
  } catch {
    images = [];
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.description || '').slice(0, 500),
    sku: product.sku || String(product.id),
    image: images.length ? images : [SITE.defaultImage],
    brand: { '@type': 'Brand', name: product.store_name || SITE.name },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(path),
      priceCurrency: 'NGN',
      price: String(Number(product.price) || 0),
      availability:
        Number(product.stock) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: product.store_name || SITE.name }
    }
  };
}

export function articleJsonLd(post, path) {
  if (!post) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: (post.excerpt || post.meta_description || post.content || '')
      .replace(/<[^>]+>/g, '')
      .slice(0, 200),
    image: absoluteUrl(post.featured_image || SITE.defaultImage),
    datePublished: post.created_at || post.published_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Organization',
      name: post.author_name || SITE.name
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: SITE.defaultImage }
    },
    mainEntityOfPage: absoluteUrl(path)
  };
}

export function clearSeoJsonLd(id = 'page') {
  setJsonLd(id, null);
}

export { SITE, absoluteUrl, ensureMeta };
