function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }

export function applyBaseToProfile(value, base) {
  if (Array.isArray(value)) return value.map(item => applyBaseToProfile(item, base));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, applyBaseToProfile(item, base)]));
  if (typeof value !== 'string' || !/^\/(?:profiles|shared|base)\//.test(value)) return value;
  return `/${String(base || '/').replace(/^\/+|\/+$/g, '')}/${value.replace(/^\/+/, '')}`.replace(/^\/\//, '/');
}

export function renderProfileHtml(template, profile) {
  const { seo, brand, theme } = profile;
  const absoluteImage = new URL(seo.socialImage, seo.canonicalUrl).href;
  const schema = { ...seo.schema, image: seo.schema.image ? new URL(seo.schema.image, seo.canonicalUrl).href : undefined };
  const metadata = `<meta name="theme-color" content="${escapeHtml(theme.colors.midnight)}" /><title>${escapeHtml(seo.title)}</title><meta name="description" content="${escapeHtml(seo.description)}" /><link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" /><link rel="icon" href="${escapeHtml(seo.favicon)}" /><link rel="apple-touch-icon" href="${escapeHtml(seo.touchIcon)}" /><meta property="og:type" content="website" /><meta property="og:locale" content="${escapeHtml(seo.locale)}" /><meta property="og:site_name" content="${escapeHtml(brand.businessName)}" /><meta property="og:title" content="${escapeHtml(seo.title)}" /><meta property="og:description" content="${escapeHtml(seo.description)}" /><meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" /><meta property="og:image" content="${escapeHtml(absoluteImage)}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${escapeHtml(seo.title)}" /><meta name="twitter:description" content="${escapeHtml(seo.description)}" /><meta name="twitter:image" content="${escapeHtml(absoluteImage)}" /><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;
  return template.replace('<html lang=""', `<html lang="${escapeHtml(theme.language)}" dir="${escapeHtml(theme.direction)}"`).replace('<!-- PROFILE_METADATA -->', metadata);
}
