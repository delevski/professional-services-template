import { expect, it } from 'vitest';
import { applyBaseToProfile, renderProfileHtml } from './profileHtml';

const template = '<html lang=""><head><!-- PROFILE_METADATA --></head></html>';
const fixture = {
  brand: { businessName: 'עסק אחר' }, theme: { language: 'en', direction: 'ltr', colors: { midnight: '#123456' } },
  contact: { phone: '+1', email: 'a@example.com', location: 'Elsewhere' }, serviceArea: { areas: ['North'] },
  hero: { image: '/profiles/other/hero.webp' },
  seo: { title: 'Different title', description: 'Different description', canonicalUrl: 'https://example.com/site/', socialImage: '/base/social.jpg', favicon: '/base/icon.svg', touchIcon: '/base/touch.png', locale: 'en_US', schema: { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Example Co — fictional demo', description: 'Schema description', url: 'https://example.com/site/', image: '/base/social.jpg', telephone: '+1', email: 'a@example.com', areaServed: ['Ontario'], address: { '@type': 'PostalAddress', addressRegion: 'Ontario', addressCountry: 'CA' } } },
};

it('generates all discoverability metadata from the selected profile', () => {
  const html = renderProfileHtml(template, fixture);
  expect(html).toContain('<title>Different title</title>');
  expect(html).toContain('content="Different description"');
  expect(html).toContain('href="https://example.com/site/"');
  expect(html).toContain('href="/base/icon.svg"');
  expect(html).toContain('href="/base/touch.png"');
  expect(html).toContain('content="https://example.com/base/social.jpg"');
  expect(html).toContain('content="עסק אחר"');
  expect(html).toContain('"@type":"ProfessionalService"');
  expect(html).toContain('"name":"Example Co — fictional demo"');
  expect(html).toContain('"addressCountry":"CA"');
  expect(html).not.toContain('עסק לדוגמה');
  expect(html).not.toContain('"addressCountry":"IL"');
  expect(html).not.toContain('aggregateRating');
});

it('rewrites every profile-local asset from Vite resolved base', () => {
  const based = applyBaseToProfile(fixture, '/another-repo/');
  expect(based.seo.favicon).toBe('/another-repo/base/icon.svg');
  expect(based.seo.socialImage).toBe('/another-repo/base/social.jpg');
  expect(based.seo.schema.image).toBe('/another-repo/base/social.jpg');
  expect(based.hero.image).toBe('/another-repo/profiles/other/hero.webp');
});
