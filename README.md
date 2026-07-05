# Professional Services Template

A reusable, profile-driven React website for independent professional-service businesses. The included electrician is a fictional Hebrew demo; names, credentials, prices, contact details, projects, and testimonials must be replaced before production use.

[![Electrician profile preview](https://delevski.github.io/professional-services-template/profiles/electrician/social-preview.jpg)](https://delevski.github.io/professional-services-template/)

**[Open the live electrician preview](https://delevski.github.io/professional-services-template/)**

## Reusable by design

Shared presentation and behavior live in `src/core/`. Each profession owns its copy, theme, configuration, form choices, SEO data, and assets in an isolated directory under `src/profiles/` and `public/profiles/`. `src/profiles/index.js` selects the active build profile.

Every real business or profession should be deployed from a **separate repository and Pages site**. Do not mix client profiles or production lead data in this demo repository. See [Profile authoring](docs/profile-authoring.md) for the complete duplication and deployment checklist.

Discoverability metadata is generated at build time from the active profile's `seo`, brand, contact, and service-area data. The footer privacy copy is also profile-owned; replace the demo browser-storage notice with a reviewed production policy before collecting real leads.

## Local development

```sh
npm ci
npm run dev
```

Production verification:

```sh
npm test -- --run
npm run build
```

The demo stores leads in the visitor's browser when `VITE_LEAD_ENDPOINT` is unset. For production, add `VITE_LEAD_ENDPOINT` as a GitHub Actions **repository variable** (Settings → Secrets and variables → Actions → Variables). Vite embeds it in client code, so it is client-visible and must never contain a secret or credential. Keep the variable unset for demo mode.
