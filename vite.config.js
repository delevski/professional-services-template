import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ACTIVE_PROFILE } from './src/profiles/index.js';
import { renderProfileHtml } from './src/build/profileHtml.js';

export default defineConfig({
  base: '/professional-services-template/',
  plugins: [{ name: 'active-profile-html', transformIndexHtml: html => renderProfileHtml(html, ACTIVE_PROFILE) }, react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    testTimeout: 15000,
  },
});
