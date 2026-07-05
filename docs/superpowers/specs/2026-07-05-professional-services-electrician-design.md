# Professional Services Template — Electrician Design

## Goal

Create a fully independent, reusable professional-services website system whose first profile is a premium Hebrew website for a fictional certified electrician. The existing Pilates repository must remain untouched. Future professions such as mechanics, locksmiths, metalworkers, plumbers, and technicians should be added as isolated profiles rather than copied applications.

## Repository and Deployment Isolation

- New project directory and Git repository: `professional-services-template`.
- The new repository does not import, link to, or modify files in `pilaties-template`.
- Independent package manifest, build, tests, assets, GitHub Actions workflow, README, and GitHub Pages deployment.
- Target repository: `delevski/professional-services-template`.
- Target Pages URL: `https://delevski.github.io/professional-services-template/`.
- Vite base path must be `/professional-services-template/`.

## Reusable Profile Architecture

### Core Layer

`src/core/` owns domain-neutral presentation and behavior:

- header and responsive navigation
- hero layout
- trust/value cards
- services and projects galleries
- testimonials
- pricing or service packages
- professional biography and credentials
- service area and availability
- FAQ
- final call to action
- lead modal
- floating phone, WhatsApp, progress, and back-to-top controls
- shared animation and accessibility hooks
- lead and WhatsApp adapters

Core components receive profile data through props or a profile context. They do not contain electrician-specific copy, prices, colors, contact details, or image paths.

### Profile Layer

`src/profiles/electrician/` owns:

- Hebrew brand and conversion copy
- business configuration
- navigation labels
- services, projects, testimonials, packages, credentials, areas, and FAQ
- theme tokens
- SEO and structured data
- lead form field labels and choices
- domain-specific icon selection

`src/profiles/index.js` exports the active build profile. A future profession is created by adding one profile directory and its assets, then selecting it without duplicating core components.

### Asset Isolation

- All electrician images live under `public/profiles/electrician/`.
- Shared neutral assets, if any, live under `public/shared/`.
- Every profile supplies its own favicon, social preview, portraits, hero media, project imagery, and testimonial portraits.

## Electrician Brand

- Fictional professional: אורי לוי.
- Business name: אורי לוי — חשמל פרימיום.
- Positioning: certified, careful, punctual, transparent, and suitable for premium homes and businesses.
- Primary headline: “חשמל בטוח. עבודה מדויקת. שקט אמיתי.”
- Primary action: “קבלו הצעת מחיר”.
- Supporting actions: “התקשרו עכשיו” and WhatsApp.
- All names, credentials, prices, phone numbers, reviews, and locations are visibly identified as sample content pending replacement.

## Language and Direction

- Hebrew-only interface.
- Document language `he` and direction `rtl`.
- Proper bidirectional handling for phone numbers, email, prices, and technical model names.
- Hebrew typography must remain readable and balanced on desktop and mobile.

## Visual Direction

Technical Luxury, clearly distinct from the wellness brand:

- deep charcoal and midnight navy backgrounds
- warm off-white surfaces
- copper accents
- restrained electric amber highlights
- clean geometric shapes inspired by circuits, switches, and architectural lighting
- premium glass panels used sparingly
- strong, calm visual hierarchy rather than emergency-service clutter

Motion includes section reveals, hover feedback, counters, smooth scrolling, subtle background movement, and optional hero parallax. All motion respects reduced-motion preferences.

## Photography

Generate a consistent fictional electrician across all key images:

- confident hero portrait looking toward the visitor
- electrician working safely on a modern distribution board
- architectural lighting installation
- EV charging station installation
- smart-home controls and wiring
- professional biography portrait

The subject should look like the same person across the set: Israeli/Mediterranean appearance, approximately 38–45 years old, clean navy workwear, no visible brand logos, professional safety equipment when required, and realistic tools and environments. Images must not depict unsafe live electrical work.

Assets are optimized to WebP, sized for their display contexts, stored locally, and loaded lazily below the fold.

## Page Structure and Copy Intent

### Hero

- Brand, primary headline, concise value proposition, and three conversion paths.
- Trust points: חשמלאי מוסמך, אחריות מלאה, זמינות מהירה, עבודה נקייה.
- Hero media with fictional electrician in a premium modern residential setting.

### Why Choose Ori

- בטיחות ללא פשרות
- אבחון מדויק
- שקיפות במחיר
- עמידה בזמנים

### Services

- איתור ותיקון תקלות
- לוחות חשמל
- התקנת נקודות ותאורה
- הכנה לעמדות טעינה
- בתים חכמים
- תחזוקת עסקים

Each service includes a concise practical description and a relevant conversion prompt.

### Selected Projects

A premium gallery showing residential, retail, office, lighting, EV, and smart-home work. Each project includes type, challenge, result, and relevant service.

### Testimonials

Five clearly fictional sample reviews covering reliability, cleanliness, communication, diagnosis, and finish quality.

### Packages and Starting Prices

Three transparent starting-price cards for common job categories. Prices are sample values, use “החל מ־”, and state that a final quote follows diagnosis.

### About and Credentials

Fictional biography, years of experience, project count, certification placeholders, insurance, and warranty language. All claims remain marked as sample content.

### Service Area and Availability

Central Israel sample coverage with normal working hours and a separate urgent-call message. The site must not promise exact arrival times.

### FAQ

Pricing, urgent calls, certification, warranties, arrival preparation, fault diagnosis, smart homes, EV charging, and areas served.

### Final CTA and Footer

Strong quotation CTA, direct phone, WhatsApp, email, sample location, navigation, privacy link, and sample-content disclosure.

## Lead and Contact Flow

### Primary Lead Modal

Fields:

- full name
- phone
- work type
- area/city
- urgency
- short description

Submission behavior:

1. Validate required fields without clearing visitor input.
2. Normalize and submit through `LEAD_ENDPOINT` when configured.
3. In demo mode, save locally with a clear non-production adapter.
4. After successful persistence, open WhatsApp with a structured Hebrew summary.
5. Show a success state and a manual WhatsApp continuation link in case popup blocking prevents automatic opening.
6. Preserve entered data and show retry guidance when lead delivery fails.

### Direct Contact

- A fixed phone action supports urgent calls.
- A fixed WhatsApp action opens a prepared introductory message.
- Contact links use fictional sample details until replaced.

## SEO and Metadata

- Semantic Hebrew headings and sections.
- Search description focused on certified electrical services in the sample area.
- Canonical URL and GitHub Pages-safe asset URLs.
- Open Graph and Twitter large-image metadata.
- Dedicated favicon, Apple touch icon, and 1200×630 social image.
- JSON-LD using the most suitable supported LocalBusiness/Electrician representation without unsupported or fabricated ratings.
- `robots.txt` and sitemap appropriate for a single-page static site.

## Accessibility and Performance

- Mobile-first responsive implementation.
- Keyboard-accessible navigation, modal, accordions, and controls.
- Focus trapping and restoration for the lead modal.
- Visible focus styles and sufficient color contrast.
- Accessible names for icon-only controls.
- Correct image alt text and decorative-image handling.
- Reduced-motion mode.
- Optimized local assets, lazy loading below the fold, and no runtime dependency on external image hosts.

## Testing

Automated tests cover:

- active profile selection
- absence of Pilates/Lumina copy in the electrician build
- rendering of key Hebrew content and RTL document direction
- lead validation, submission, failure retention, and success state
- WhatsApp message generation and encoding
- FAQ interaction
- mobile navigation
- profile-safe asset URL resolution under the GitHub Pages base path

Verification also includes the full test suite, production build, React diagnostics, HTML metadata inspection, image dimension checks, desktop/mobile browser review, and a scan confirming that the Pilates repository remains clean and unchanged.

## Documentation for Future Professions

README documentation explains:

1. how the core/profile separation works
2. how to copy the electrician profile into a new profession profile
3. which configuration, copy, icons, colors, SEO, form choices, and assets must be replaced
4. how to choose the active profile
5. how to configure lead delivery and WhatsApp safely
6. how to create a separate GitHub repository and Pages deployment

No future profile should require editing an existing profile’s files.
