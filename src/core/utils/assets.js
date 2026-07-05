export function assetUrl(path, baseUrl = import.meta.env.BASE_URL) {
  if (!path || /^(?:[a-z]+:|\/\/)/i.test(path)) return path;
  const base = `/${String(baseUrl || '/').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  return `${base}${String(path).replace(/^\/+/, '')}`;
}
