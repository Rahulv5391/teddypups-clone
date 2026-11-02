# Reference screenshots — https://puppy.instabizweb.com

Captured 2026-11-02.

| Folder | What | How |
|---|---|---|
| `full-page/1440-desktop/` | Full-page shot of all 12 pages/states | Playwright (headless Chromium) |
| `full-page/1280-laptop/` | Same at 1280px | Playwright |
| `full-page/768-tablet/` | Same at 768px (touch) | Playwright |
| `full-page/375-mobile/` | Same at 375px (touch) | Playwright |
| `sections/01-home-1440-desktop/` | Home, viewport by viewport (shows the scroll-driven "Meet the pups" door hall properly) | Playwright |
| `sections/01-home-375-mobile/` | Same on mobile | Playwright |
| `states/` | Mobile menu open (768, 375) | Playwright |
| `chrome-1280/home-slices/` | Home, 18 viewport shots at 1280x551 | Claude in Chrome |

Pages: 01 home · 02 puppies · 03 `?breed=poodle` · 04 `?origin=imported` · 05 puppy detail (available) ·
06 puppy detail (gone home) · 07 gone-home · 08 happy-families · 09 how-it-works · 10 faq · 11 contact · 12 404

Note: in full-page shots the pinned/scroll-driven sections (home "Meet the pups") render at scroll position 0,
so use the `sections/` slices for those.
