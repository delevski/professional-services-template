# Professional Services Electrician Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an independent reusable professional-services template and its first premium Hebrew electrician profile, ready for separate GitHub Pages deployment.

**Architecture:** Domain-neutral React components under `src/core/` consume one selected profile object. The electrician profile owns all copy, theme tokens, icons, SEO, form choices, and asset paths under `src/profiles/electrician/`; future trades add profiles without modifying existing ones.

**Tech Stack:** React 19, Vite, Vitest, Testing Library, Lucide React, CSS, GitHub Actions, locally generated WebP assets

## Global Constraints

- Do not modify or import from `/Users/corphd/Desktop/Or codes projects/pilaties-template`.
- Hebrew-only, `lang="he"`, and `dir="rtl"`.
- Vite base path: `/professional-services-template/`.
- Every business claim, credential, price, review, and contact detail is marked as fictional sample content.
- Lead delivery and WhatsApp are configurable boundaries; no private credential is stored in frontend code.
- Core components contain no electrician-specific copy or asset paths.
- Local optimized assets only; no runtime image hosts.
- Mobile-first, keyboard accessible, reduced-motion aware, and GitHub Pages deployable.

---

### Task 1: Scaffold and Profile Contract

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/test/setup.js`
- Create: `src/profiles/index.js`
- Create: `src/profiles/electrician/profile.js`
- Create: `src/profiles/profile.test.js`

**Interfaces:**
- Produces `ACTIVE_PROFILE`, an object containing `id`, `brand`, `theme`, `navigation`, `hero`, `trust`, `services`, `projects`, `testimonials`, `packages`, `professional`, `serviceArea`, `faq`, `contact`, `leadForm`, and `seo`.
- `App` consumes `ACTIVE_PROFILE` and passes it into core sections.

- [ ] **Step 1: Write the failing profile-isolation test**

```js
import { describe, expect, it } from 'vitest';
import { ACTIVE_PROFILE } from './index';

describe('active professional profile', () => {
  it('selects the isolated electrician profile', () => {
    expect(ACTIVE_PROFILE.id).toBe('electrician');
    expect(ACTIVE_PROFILE.brand.name).toBe('אורי לוי');
    expect(JSON.stringify(ACTIVE_PROFILE)).not.toMatch(/pilates|lumina/i);
  });

  it('provides the complete core contract', () => {
    for (const key of ['brand','theme','navigation','hero','trust','services','projects','testimonials','packages','professional','serviceArea','faq','contact','leadForm','seo']) {
      expect(ACTIVE_PROFILE[key]).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/profiles/profile.test.js --run`
Expected: FAIL because the project modules do not exist.

- [ ] **Step 3: Create the independent Vite package**

```json
{
  "name": "professional-services-template",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "lucide-react": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "jsdom": "latest",
    "vite": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 4: Configure Vite and tests**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/professional-services-template/',
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.js', testTimeout: 15000 },
});
```

- [ ] **Step 5: Create the electrician profile contract**

Populate the complete `ACTIVE_PROFILE` with the approved fictional brand and Hebrew data. Asset paths use `assetUrl('profiles/electrician/...')`; contact values use explicit demo phone, WhatsApp, email, and service area fields.

- [ ] **Step 6: Install dependencies and run GREEN**

Run: `npm install && npm test -- src/profiles/profile.test.js --run`
Expected: profile tests PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html .gitignore src
git commit -m "Scaffold reusable professional services profiles"
```

---

### Task 2: Domain-Neutral Page Components

**Files:**
- Create: `src/core/components/BrandMark.jsx`
- Create: `src/core/components/Button.jsx`
- Create: `src/core/components/Header.jsx`
- Create: `src/core/components/Hero.jsx`
- Create: `src/core/components/Trust.jsx`
- Create: `src/core/components/Services.jsx`
- Create: `src/core/components/Projects.jsx`
- Create: `src/core/components/Testimonials.jsx`
- Create: `src/core/components/Packages.jsx`
- Create: `src/core/components/Professional.jsx`
- Create: `src/core/components/ServiceArea.jsx`
- Create: `src/core/components/Faq.jsx`
- Create: `src/core/components/FinalCta.jsx`
- Create: `src/core/components/Footer.jsx`
- Create: `src/core/components/FloatingActions.jsx`
- Create: `src/core/hooks/useScrollUI.js`
- Create: `src/core/hooks/useReveal.js`
- Create: `src/core/utils/assets.js`
- Create: `src/core/utils/assets.test.js`
- Create: `src/styles.css`
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

**Interfaces:**
- Every section accepts a `profile` or specific profile slice.
- `assetUrl(path, baseUrl?)` returns GitHub Pages-safe public URLs.
- Conversion components receive `onQuote` instead of importing profile details.

- [ ] **Step 1: Write failing page and asset tests**

```jsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import App from './App';

it('renders the Hebrew electrician conversion page without Pilates copy', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /חשמל בטוח/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /קבלו הצעת מחיר/ })).toBeInTheDocument();
  expect(document.documentElement.dir).toBe('rtl');
  expect(document.body.textContent).not.toMatch(/pilates|lumina/i);
});
```

```js
import { expect, it } from 'vitest';
import { assetUrl } from './assets';

it('creates profile-safe GitHub Pages asset paths', () => {
  expect(assetUrl('/profiles/electrician/hero.webp', '/professional-services-template/')).toBe('/professional-services-template/profiles/electrician/hero.webp');
});
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/App.test.jsx src/core/utils/assets.test.js --run`
Expected: FAIL because core components and utility do not exist.

- [ ] **Step 3: Implement the page skeleton**

`App` renders sections in this order: Header, Hero, Trust, Services, Projects, Testimonials, Packages, Professional, ServiceArea, FAQ, FinalCTA, Footer, FloatingActions, QuoteModal. All visible copy comes from `ACTIVE_PROFILE`.

- [ ] **Step 4: Implement Technical Luxury CSS**

Define theme custom properties from the active profile and provide responsive grids, RTL-safe logical properties, focus states, sticky navigation, reveal animations, gallery hover states, testimonial controls, accordion behavior, progress bar, floating phone/WhatsApp actions, and reduced motion.

- [ ] **Step 5: Run GREEN and responsive component tests**

Run: `npm test -- src/App.test.jsx src/core/utils/assets.test.js --run`
Expected: page and asset tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "Build profile-driven professional landing page"
```

---

### Task 3: Quote Lead and WhatsApp Flow

**Files:**
- Create: `src/core/services/leads.js`
- Create: `src/core/services/leads.test.js`
- Create: `src/core/utils/whatsapp.js`
- Create: `src/core/utils/whatsapp.test.js`
- Create: `src/core/components/QuoteModal.jsx`
- Create: `src/core/components/QuoteModal.test.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- `submitLead(input, endpoint?)` returns `{ id, storedAt }`.
- `buildWhatsAppUrl(input, whatsappNumber)` returns a properly encoded `wa.me` URL.
- `QuoteModal` accepts `open`, `onClose`, `profile`, and injectable `submitLeadFn`.

- [ ] **Step 1: Write failing service tests**

Test normalized Hebrew lead fields, local demo persistence, endpoint failure, and WhatsApp encoding of work type, city, urgency, and description.

- [ ] **Step 2: Write failing modal tests**

Test accessible dialog name, required-field errors, successful explicit submission, automatic WhatsApp opening only after persistence, manual continuation link, Escape close, focus restoration, and retained values on failure.

- [ ] **Step 3: Run RED**

Run: `npm test -- src/core/services/leads.test.js src/core/utils/whatsapp.test.js src/core/components/QuoteModal.test.jsx --run`
Expected: FAIL because the services and modal do not exist.

- [ ] **Step 4: Implement lead adapter**

Use a profile-independent record with `name`, `phone`, `workType`, `city`, `urgency`, and `description`. Store under a project-specific local-storage key in demo mode; POST JSON only when `LEAD_ENDPOINT` is configured.

- [ ] **Step 5: Implement WhatsApp utility and modal**

Build a structured Hebrew message from the submitted record. Open WhatsApp after successful persistence and render a stable manual link. Keep form values after errors.

- [ ] **Step 6: Run GREEN**

Run: `npm test -- src/core/services/leads.test.js src/core/utils/whatsapp.test.js src/core/components/QuoteModal.test.jsx --run`
Expected: all lead-flow tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "Add quotation lead and WhatsApp flow"
```

---

### Task 4: Consistent Electrician Photography and Brand Assets

**Files:**
- Create: `public/profiles/electrician/hero.webp`
- Create: `public/profiles/electrician/panel-work.webp`
- Create: `public/profiles/electrician/lighting.webp`
- Create: `public/profiles/electrician/ev-charging.webp`
- Create: `public/profiles/electrician/smart-home.webp`
- Create: `public/profiles/electrician/professional.webp`
- Create: `public/profiles/electrician/client-1.webp` through `client-5.webp`
- Create: `public/profiles/electrician/favicon.svg`
- Create: `public/profiles/electrician/apple-touch-icon.png`
- Create: `public/profiles/electrician/social-preview.jpg`

- [ ] **Step 1: Generate the hero subject**

Create a photorealistic fictional Israeli/Mediterranean male electrician, age 38–45, consistent face, neat navy workwear without logos, calm confident expression, in a premium modern home with architectural lighting and safe professional tools.

- [ ] **Step 2: Generate consistent work scenes**

Use the hero as reference for panel work, lighting, EV charging, smart-home, and biography scenes. Require de-energized/safe electrical work, realistic PPE, clean tools, and no text or logos.

- [ ] **Step 3: Generate sample client portraits**

Create five diverse, natural Israeli customer portraits suitable for clearly fictional testimonials.

- [ ] **Step 4: Create brand icons and social card**

Create a circuit/lightning monogram favicon, 180×180 touch icon, and 1200×630 cinematic social preview with exact Hebrew brand typography applied deterministically after image generation.

- [ ] **Step 5: Optimize and inspect**

Verify dimensions, convert below-fold assets to WebP, inspect every image, confirm person consistency, reject electrical safety artifacts, and keep reasonable file sizes.

- [ ] **Step 6: Commit**

```bash
git add public
git commit -m "Add original electrician brand photography"
```

---

### Task 5: SEO, Deployment, Documentation, and Final Verification

**Files:**
- Modify: `index.html`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Create: `.github/workflows/pages.yml`
- Create: `README.md`
- Create: `docs/profile-authoring.md`

- [ ] **Step 1: Add Hebrew metadata**

Set `lang="he"`, `dir="rtl"`, title, description, canonical URL, Open Graph, Twitter card, favicon, touch icon, and LocalBusiness/Electrician JSON-LD using profile sample details without fabricated rating aggregates.

- [ ] **Step 2: Add GitHub Pages workflow**

Use official checkout, Node setup, install, test, build, configure-pages, upload-pages-artifact, and deploy-pages actions with Pages permissions and concurrency control.

- [ ] **Step 3: Document profile creation**

Explain exact steps to duplicate `src/profiles/electrician`, replace every data category and asset directory, select the new profile, update base/canonical paths, configure leads, run tests, create a separate repository, and enable Pages.

- [ ] **Step 4: Run final automated verification**

Run: `npm test -- --run && npm run build && npx -y react-doctor@latest . --verbose --scope changed && git diff --check`
Expected: all tests and build PASS with no new actionable React diagnostics.

- [ ] **Step 5: Verify metadata and isolation**

Confirm build output contains all profile assets and production URLs. Run a repository scan proving no Pilates/Lumina content exists. Run `git status -sb` in the Pilates repository and confirm it remains clean.

- [ ] **Step 6: Verify in browser**

Inspect desktop, tablet, and mobile; open and submit the quote form in demo mode; verify phone and WhatsApp links; test keyboard navigation, FAQ, menu, animations, and reduced-motion behavior.

- [ ] **Step 7: Commit and publish**

Rename the branch to `main`, add `https://github.com/delevski/professional-services-template.git` as origin, push, enable Pages through workflow, and verify the live URL after deployment.
