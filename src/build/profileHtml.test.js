import { expect, it } from 'vitest';
import { renderProfileHtml } from './profileHtml';

const template = '<html lang=""><head><!-- PROFILE_METADATA --></head></html>';
const fixture = {
  brand: { businessName: 'עסק אחר' }, theme: { language: 'en', direction: 'ltr', colors: { midnight: '#123456' } },
  contact: { phone: '+1', email: 'a@example.com', location: 'Elsewhere' }, serviceArea: { areas: ['North'] },
  seo: { title: 'Different title', description: 'Different description', canonicalUrl: 'https://example.com/site/', socialImage: '/base/social.jpg', favicon: '/base/icon.svg', touchIcon: '/base/touch.png', locale: 'en_US', schemaType: 'ProfessionalService' },
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
  expect(html).not.toContain('aggregateRating');
});
