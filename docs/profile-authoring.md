# Profile authoring and separate deployment

Use one repository and deployment per real business. The core is reusable, but each profile's business data, assets, lead destination, canonical URL, and deployment belong to that business alone.

## 1. Duplicate the profile

1. Copy `src/profiles/electrician/` to `src/profiles/<profile-id>/`.
2. Copy `public/profiles/electrician/` to `public/profiles/<profile-id>/`.
3. Rename the exported profile object and change its `id`.
4. Keep core components profession-neutral. A new profile must not require editing an existing profile.

## 2. Replace every profile data category

In the new `profile.js`, replace all of the following rather than leaving electrician placeholders:

- brand name, descriptor, disclosure, navigation, interface labels, and calls to action
- theme colors, direction, and language
- hero, trust points, services, projects, testimonials, packages, professional biography, statistics, credentials, service areas, hours, FAQ, and footer copy
- every name, claim, price, certification, warranty, location, phone number, WhatsApp number, email address, and prepared message
- form headings, field labels, work types, urgency choices, validation copy, local-storage key, and WhatsApp summary labels
- SEO title, description, locale, canonical URL, favicon, and social image
- domain icon keys used by the profile

Update the static metadata and JSON-LD in `index.html` to match. Do not publish sample claims or add ratings unless they are real, supportable business data.

## 3. Replace all assets

Replace every file in `public/profiles/<profile-id>/`: hero and professional portraits, project and testimonial images, favicon, Apple touch icon, and the 1200×630 social preview. Update every asset path in the profile. Keep assets local, optimized, and isolated from other profiles.

## 4. Select the profile

Change `src/profiles/index.js` to export the new profile as `ACTIVE_PROFILE`. Run the site and check that no copy or paths from another profession remain.

## 5. Set repository and production URLs

Create a new repository for the business. Set `base` in `vite.config.js` to `/<repository-name>/` (or `/` for a custom root domain). Update the canonical, Open Graph, Twitter, JSON-LD, sitemap, robots sitemap URL, README preview, and all production asset URLs to the final HTTPS address.

## 6. Configure leads safely

Without `VITE_LEAD_ENDPOINT`, the demo adapter stores submissions only in the visitor's `localStorage`. For production, provide `VITE_LEAD_ENDPOINT` as a build-time environment variable backed by a secure HTTPS service. Validate and rate-limit on the server, configure CORS narrowly, avoid secrets in `VITE_*` variables, and test failure/retry behavior. Replace the sample phone and WhatsApp numbers before launch.

## 7. Verify

```sh
npm ci
npm test -- --run
npm run build
npx -y react-doctor@latest . --verbose --scope changed
git diff --check
```

Inspect the production build at desktop, tablet, and mobile widths. Test keyboard navigation, menu, FAQ, reduced motion, phone and WhatsApp links, and lead submission in both demo and configured-endpoint modes. Confirm built asset paths use the configured base and scan for old profession/client content.

## 8. Deploy separately with GitHub Pages

1. Push the project to the new business repository with `main` as the default branch.
2. Keep `.github/workflows/pages.yml`; it tests and builds before deployment.
3. In **Settings → Pages**, choose **GitHub Actions** as the source.
4. Add `VITE_LEAD_ENDPOINT` through repository Actions configuration only if the production build needs it; never commit a secret.
5. Run the workflow, confirm both build and deploy jobs pass, and inspect the live canonical URL.
