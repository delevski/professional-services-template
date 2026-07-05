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
- SEO title, description, locale, canonical URL, favicon, touch icon, social image, and supported schema type. The Vite HTML transform generates title, canonical, Open Graph, Twitter, icons, and JSON-LD from this one profile source; do not hand-edit `index.html` metadata.
- privacy label, anchor, heading, and policy text. Replace the demo local-storage explanation with the business's reviewed production privacy policy and lead-provider disclosures before launch.
- domain icon keys used by the profile

Do not add ratings to structured data unless they are real and supportable.

## 3. Replace all assets

Replace every file in `public/profiles/<profile-id>/`: hero and professional portraits, project and testimonial images, favicon, Apple touch icon, and the 1200×630 social preview. Update every asset path in the profile. Keep assets local, optimized, and isolated from other profiles.

## 4. Select the profile

Change `src/profiles/index.js` to export the new profile as `ACTIVE_PROFILE`. Run the site and check that no copy or paths from another profession remain.

## 5. Set repository and production URLs

Create a new repository for the business. Set `base` in `vite.config.js` to `/<repository-name>/` (or `/` for a custom root domain). Update the canonical, Open Graph, Twitter, JSON-LD, sitemap, robots sitemap URL, README preview, and all production asset URLs to the final HTTPS address.

## 6. Configure leads safely

Without `VITE_LEAD_ENDPOINT`, the demo adapter stores submissions only in the visitor's `localStorage`. Keep it unset for demo mode. For production, add `VITE_LEAD_ENDPOINT` as a GitHub Actions **repository variable** under Settings → Secrets and variables → Actions → Variables; the Pages workflow explicitly maps that variable into the Vite build. Every `VITE_*` value is embedded in client code and is publicly visible, so this endpoint must never be stored as a GitHub secret and must never contain credentials or secret tokens. Point it at a secure HTTPS service, validate and rate-limit on the server, configure CORS narrowly, and test failure/retry behavior. Replace the sample phone and WhatsApp numbers before launch.

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
4. If production delivery is needed, add `VITE_LEAD_ENDPOINT` as an Actions repository variable. It is client-visible, never a secret; leave it unset for the demo adapter.
5. Run the workflow, confirm both build and deploy jobs pass, and inspect the live canonical URL.
