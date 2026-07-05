# Electrician Hero Video Design

## Goal

Replace the electrician profile's static hero portrait with the supplied local MP4 while preserving the existing premium hero composition and responsive dimensions.

## Media behavior

- Store the MP4 inside `public/profiles/electrician/` so GitHub Pages serves it as a local profile asset.
- Render the hero media as an HTML `<video>` with `autoPlay`, `muted`, `loop`, and `playsInline`.
- Keep the current hero image as the `poster` and visual fallback while the video loads or cannot play.
- Treat the video as decorative because the adjacent hero copy communicates the business message; it must not introduce duplicate spoken or screen-reader content.
- Preserve the existing media frame at every breakpoint with `width: 100%`, `height: 100%`, and `object-fit: cover`.

## Profile contract

- Add a profile-owned hero video asset path while retaining the profile-owned image/poster path.
- Keep the component domain-neutral: render video when the active profile provides one, otherwise render the existing image.
- Ensure Vite's resolved GitHub Pages base rewrites the new video asset path like every other profile-local asset.

## Performance and compatibility

- Use the supplied H.264 MP4 directly; it is broadly browser-compatible and approximately eight seconds long.
- Use `preload="metadata"` to avoid forcing the full video download before the rest of the page is usable.
- Do not expose audio controls; the video remains muted by default and continuously loops.

## Verification

- Add a component test that proves the electrician profile renders a muted, looping, inline autoplay video with the correct source and poster.
- Confirm a profile without video still renders its image fallback.
- Run the full test suite, production build, React Doctor, and `git diff --check`.
- Verify the built MP4 path and local hero playback before committing and pushing.
