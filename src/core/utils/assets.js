export function assetUrl(path, baseUrl = import.meta.env?.BASE_URL ?? '/professional-services-template/') {
  if (!path || /^(?:[a-z]+:|\/\/)/i.test(path)) return path;
  const base = `/${String(baseUrl || '/').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  return `${base}${String(path).replace(/^\/+/, '')}`;
}
