import { mediaUrl } from '@/utils/mediaUrl';
import { env } from '@/config/env';

const SITE = {
  name: 'Origin Electric',
  // Canonical host where this Vue SPA is actually served (not the apex lander redirect).
  url: env.siteUrl.replace(/\/$/, ''),
  defaultImage: `${env.siteUrl.replace(/\/$/, '')}/logo.png`,
  twitter: '@originelectric',
  locale: 'en_NG',
  sameAs: [env.siteUrl.replace(/\/$/, ''), 'https://originelectric.com']
};

/** Strip HTML / collapse whitespace for meta descriptions */
export function plainText(value, max = 160) {
  const text = String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!max || text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

export function buildMetaDescription(primary, fallback) {
  const fromPrimary = plainText(primary, 160);
  if (fromPrimary) return fromPrimary;
  return plainText(fallback, 160) || SITE.name;
}

/** Organization + WebSite JSON-LD for homepage / brand SERP signals */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: {
          '@type': 'ImageObject',
          url: SITE.defaultImage
        },
        description:
          'Solar, inverter, CCTV, access control, and electrical engineering solutions for homes and industry in Nigeria.',
        areaServed: { '@type': 'Country', name: 'Nigeria' },
        sameAs: SITE.sameAs
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: 'en-NG',
        publisher: { '@id': `${SITE.url}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE.url}/marketplace?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };
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
 * Client-side SPA: updates document head after route/data load.
 */
export function applySeo({
  title,
  description,
  path,
  image,
  imageAlt,
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

  const desc = buildMetaDescription(
    description,
    'Origin Electric — solar, inverters, CCTV, and engineering for homes and industry in Nigeria.'
  );

  const url = absoluteUrl(path || (typeof window !== 'undefined' ? window.location.pathname : '/'));
  const img = absoluteUrl(image || SITE.defaultImage);
  const alt = plainText(imageAlt || title || SITE.name, 120);

  document.title = fullTitle;

  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  setOrCreate('name', 'description', desc);
  setOrCreate('name', 'robots', robots);
  setOrCreate('name', 'googlebot', robots);

  setOrCreate('property', 'og:type', type);
  setOrCreate('property', 'og:locale', SITE.locale);
  setOrCreate('property', 'og:site_name', SITE.name);
  setOrCreate('property', 'og:title', fullTitle);
  setOrCreate('property', 'og:description', plainText(desc, 200));
  setOrCreate('property', 'og:url', url);
  setOrCreate('property', 'og:image', img);
  setOrCreate('property', 'og:image:alt', alt);

  setOrCreate('name', 'twitter:card', 'summary_large_image');
  setOrCreate('name', 'twitter:title', fullTitle);
  setOrCreate('name', 'twitter:description', plainText(desc, 200));
  setOrCreate('name', 'twitter:image', img);
  setOrCreate('name', 'twitter:url', url);

  setCanonical(url);
  setJsonLd(jsonLdId, jsonLd);
}

export function breadcrumbJsonLd(items = []) {
  const list = (items || [])
    .filter((i) => i?.name && i?.path)
    .map((i, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: i.name,
      item: absoluteUrl(i.path)
    }));
  if (!list.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list
  };
}

/**
 * @param {object} product
 * @param {string} path
 * @param {{ avgRating?: number, reviewCount?: number }} [rating]
 */
export function productJsonLd(product, path, rating = {}) {
  if (!product) return null;
  let images = [];
  try {
    const raw = product.images;
    const arr = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw || [];
    images = (Array.isArray(arr) ? arr : []).map((img) => mediaUrl(img)).filter(Boolean);
  } catch {
    images = [];
  }

  const inStock = Number(product.stock) > 0;
  const price = Number(product.price);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: plainText(product.description || product.name, 500),
    sku: product.sku || String(product.id),
    image: images.length ? images : [SITE.defaultImage],
    brand: {
      '@type': 'Brand',
      name: product.brand || product.store_name || SITE.name
    },
    category: product.category || undefined,
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(path),
      priceCurrency: 'NGN',
      price: Number.isFinite(price) ? String(price) : '0',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: product.store_name || SITE.name
      }
    }
  };

  const avg = Number(rating.avgRating);
  const count = Number(rating.reviewCount);
  if (Number.isFinite(avg) && avg > 0 && Number.isFinite(count) && count > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(Math.round(avg * 10) / 10),
      reviewCount: String(Math.floor(count)),
      bestRating: '5',
      worstRating: '1'
    };
  }

  return data;
}

export function articleJsonLd(post, path) {
  if (!post) return null;
  const headline = post.seo_title || post.title;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description: buildMetaDescription(
      post.meta_description || post.excerpt || post.content,
      headline
    ),
    image: absoluteUrl(
      post.featured_image ? mediaUrl(post.featured_image) : SITE.defaultImage
    ),
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      '@type': post.author_name ? 'Person' : 'Organization',
      name: post.author_name || SITE.name
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: SITE.defaultImage }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(path)
    }
  };
}

/** Clear dynamic JSON-LD blocks when leaving product/article routes */
export function clearDynamicSeo() {
  setJsonLd('product', null);
  setJsonLd('article', null);
  setJsonLd('breadcrumb', null);
}

export function clearSeoJsonLd(id = 'page') {
  setJsonLd(id, null);
}

export function ensureMeta() {
  /* retained for callers */
}

export { SITE, absoluteUrl, setJsonLd };
