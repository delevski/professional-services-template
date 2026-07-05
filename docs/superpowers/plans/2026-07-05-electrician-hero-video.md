# Electrician Hero Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the electrician hero portrait with the supplied muted, looping MP4 while retaining the existing image as poster and fallback.

**Architecture:** Extend the active profile with an optional `hero.video` asset. The domain-neutral Hero component renders a video only when that field exists and otherwise preserves the image path. Existing Vite resolved-base asset rewriting remains the single deployment-path mechanism.

**Tech Stack:** React 19, Vite 8, Vitest, Testing Library, HTML5 video, CSS.

## Global Constraints

- Store the MP4 inside `public/profiles/electrician/`.
- Render `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`, and the current hero image as `poster`.
- Preserve the existing responsive frame with `object-fit: cover`.
- Profiles without `hero.video` continue rendering the existing image.
- The video must use the resolved GitHub Pages base and remain decorative.
- Do not modify the Pilates repository.

---

### Task 1: Profile-driven hero video

**Files:**
- Add: `public/profiles/electrician/hero-video.mp4`
- Modify: `src/profiles/electrician/profile.js`
- Modify: `src/core/components/Hero.jsx`
- Modify: `src/styles.css`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: `profile.hero.image`, `profile.hero.imageAlt`, and resolved profile asset rewriting.
- Produces: optional `profile.hero.video` and a video element with the required playback contract.

- [ ] **Step 1: Write the failing video contract test**

Add an App test that renders the active profile, locates `.hero__media video`, and asserts its `src`, `poster`, `autoplay`, `muted`, `loop`, `playsinline`, and `preload="metadata"` contract.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- --run src/App.test.jsx --reporter=verbose`

Expected: FAIL because `.hero__media video` does not exist.

- [ ] **Step 3: Add the local asset and profile field**

Copy the supplied MP4 byte-for-byte to `public/profiles/electrician/hero-video.mp4` and set `video: assetUrl('profiles/electrician/hero-video.mp4')` inside the electrician profile's `hero` object.

- [ ] **Step 4: Implement conditional video rendering**

When `profile.hero.video` exists, render a decorative `<video>` with the profile video source, image poster, and all required playback attributes. Otherwise retain the current `<img>` fallback. Apply the same absolute fill and `object-fit: cover` styling to both elements.

- [ ] **Step 5: Run focused and full verification**

Run:

```bash
npm test -- --run src/App.test.jsx --reporter=verbose
npm test -- --run --reporter=verbose
npm run build
npx -y react-doctor@latest . --verbose --diff
git diff --check
```

Expected: all tests PASS, build PASS, React Doctor reports no actionable issue, and diff check is clean.

- [ ] **Step 6: Verify the built video and local page**

Confirm `dist/profiles/electrician/hero-video.mp4` exists, the local Hero video is muted/looping/playing inline, and the current poster appears before playback.

- [ ] **Step 7: Commit and publish**

Stage the asset, component, profile, CSS, test, spec, and plan. Commit with `feat: add looping electrician hero video`, push `main`, wait for Pages to succeed, and verify the live site and video both return HTTP 200.
