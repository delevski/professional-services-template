import { expect, it } from 'vitest';
import { assetUrl } from './assets';

it('creates profile-safe GitHub Pages asset paths', () => {
  expect(assetUrl('/profiles/electrician/hero.webp', '/professional-services-template/')).toBe('/professional-services-template/profiles/electrician/hero.webp');
});

it('does not rewrite absolute or data URLs', () => {
  expect(assetUrl('https://example.com/photo.webp', '/base/')).toBe('https://example.com/photo.webp');
  expect(assetUrl('data:image/svg+xml,test', '/base/')).toBe('data:image/svg+xml,test');
});
