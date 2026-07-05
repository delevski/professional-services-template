import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ACTIVE_PROFILE } from './src/profiles/index.js';
import { applyBaseToProfile, renderProfileHtml } from './src/build/profileHtml.js';

function activeProfileHtml() {
  let profile = ACTIVE_PROFILE;
  return { name: 'active-profile-html', configResolved: config => { profile = applyBaseToProfile(ACTIVE_PROFILE, config.base); }, transformIndexHtml: html => renderProfileHtml(html, profile) };
}

export default defineConfig({
  base: '/professional-services-template/',
  plugins: [activeProfileHtml(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    testTimeout: 15000,
  },
});
