# TeddyPups Clone — Build Plan

**Assignment:** Insta Biz Web technical round. Clone https://puppy.instabizweb.com/ (design, layout, responsiveness, functionality).
**Deliverables:** live URL · public GitHub repo · Loom walkthrough (process, stack, AI tools + exact prompts, decisions, challenges, testing, deployment).
**Time budget:** 48 hours from acceptance email.

---

## 1. What the reference site actually is (reconnaissance findings)

Analysis was done by downloading the HTML, CSS, sitemap, and RSC payload, then checking the animated sections in Chrome.

| Aspect | Finding |
|---|---|
| Framework | **Next.js App Router** (RSC payload in `self.__next_f`, `/_next/image`, `data-precedence` CSS) |
| Styling | **Tailwind CSS v4** (`--color-*`, `--font-*` theme vars) plus a large hand-written BEM layer (`tp-*` classes) |
| Fonts | **Fraunces** (display), **Figtree** (body), **Shantell Sans** (handwritten accents), loaded with `next/font` |
| Animation | **Pure CSS**: 46 `@keyframes` (`tp-runner-*`, `tp-curtain-*`, `tp-door-open`, `tp-plane-bob`, `tp-msg-in`, `tp-stamp-*`, …), IntersectionObserver reveals, scroll-linked transforms. 19 `prefers-reduced-motion` rules. No animation library. |
| Illustrations | Inline **SVG scenes** drawn by hand: teddy mascot, running puppy, arched doors, house, plane/flight route, phone chat, passport stamps, dusk/night sky, Dubai skyline, quilt/scallop edges |
| Data | Puppy objects from a CMS: `id, slug, name, displayName, breed, gender, genderLabel, age, colour, description, records[], status, featured, origin, cover{url,width,height,alt,focalX,focalY,color,blurDataUrl}, media[]` (images + mp4 video with poster) |
| Forms | Client-side validated forms (`noValidate`), fields `name, phone, email, area, message, puppyId` + **honeypot `website`** field |
| SEO | Per-page `<title>`, meta description, OG/Twitter cards, `sitemap.xml`, `robots.txt`, JSON-LD (`PetStore` + `PostalAddress` on home, `BreadcrumbList` on puppy pages) |
| Hosting | Cloudflare in front (email obfuscation, insights beacon) |

### Design tokens (copied exactly from the reference CSS)

```css
--color-cocoa:      #2a170e;  /* primary text */
--color-cocoa-soft: #5a3a28;
--color-toffee:     #c2622b;  /* primary button */
--color-toffee-deep:#a24a1a;
--color-toffee-ink: #8e3f15;
--color-honey:      #f2be6b;
--color-honey-soft: #fbe3b4;
--color-milk:       #fffdf8;  /* page background */
--color-blush:      #f9cdbf;
--color-sky:        #bfddf5;
--color-sky-deep:   #2f6e9e;
--font-display: Fraunces;  --font-sans: Figtree;  --font-hand: Shantell Sans;
```
WhatsApp green is used for WhatsApp CTAs.

---

## 2. Route & page inventory

| Route | Sections / features |
|---|---|
| `/` | **Hero** (handwritten kicker "every puppy is family", big Fraunces title, 2 CTAs, row of arched photo windows over a scalloped quilt edge, teddy mascot) → **Meet the pups** (pinned stage; scroll drives a horizontal hall of arched **doors**; mascot walks the floor and doors open to reveal puppy photos with "Available" tags; ends with a "Meet them all" door) → **Two ways** (local showroom with house/door scene vs imported with animated **plane flight route** Korea→Dubai) → **Your puppy journey** (3 steps beside a **phone WhatsApp chat** mock with typing indicator, messages animating in step by step, breed chips) → **Why trust us** (puppy **passport** with 4 animated stamps) → **Happy families** (dusk sky, polaroids with tape, testimonial) → **FAQ teaser** (night sky with stars, 3 Q&As) → **Final CTA** ("welcome home", house with lamp) |
| `/puppies` | Sketchbook header, grid of 15 available puppies (status tag, ▶ video badge, breed · gender · age); **filters** by `?breed=` (maltipoo, pomeranian, poodle, cavapoo, shih-tzu) and `?origin=` (local, imported); "Already gone home" strip of 5 + link |
| `/puppies/[slug]` | Breadcrumb, media **gallery/carousel** (counter "1 / 2", prev/next, video with poster/play), "hello, it's me" note, details, **enquiry form** ("Ask about Max", prefilled message), **prev/next pup** navigation, BreadcrumbList JSON-LD. ~42 slugs in sitemap (15 available + gone-home ones) |
| `/gone-home` | 27 puppies rendered as **"one ticket home" tickets** (name, breed/gender, origin, "admit one") |
| `/happy-families` | Photo **wall of polaroids** (64 moments, emoji captions), featured testimonial |
| `/how-it-works` | Numbered table of contents (1 Two ways home, 2 Premium promise, 3 Delivery & collection `#delivery`, 4 Why choose us); local 4-step flow; imported "order upon request" flow; signposts/fork illustration |
| `/faq` | "sniff out a question" **search**, "9 notes on the board" pinned-note cards, expand/collapse Q&A, "Ask your own question" CTA |
| `/contact` | **Letter-style form** ("Dear TeddyPups, my name is ___ …") with inline inputs, puppy `<select>`, envelope/stamp send animation ("Post my letter"), WhatsApp/call/email cards, Downtown Dubai location + Google Maps link |
| `not-found` | Custom 404 in the same style |

### Global UI
- **Header:** logo + name, nav with active **paw indicator**, WhatsApp button, scallop hem; mobile **slide-in menu** ("where to, friend?") with staggered links.
- **Page-transition curtain:** a blanket curtain with a **running puppy** and paw prints covers the screen between routes.
- **Scroll mascot:** fixed `pup-layer` puppy plus a `pup-prints` trail of paw prints along the page as you scroll.
- **Footer:** hill illustration, "Home, at last." blurb, Explore / Say hello columns, socials, © line.
- **Mobile sticky bar:** "WhatsApp us" + "Call".
- Skip-to-content link, focus styles, reduced-motion fallbacks.

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + React 19 + TypeScript** | Same architecture as the reference; SSG for all pages; `next/image`, `next/font`, metadata API, sitemap/robots routes |
| Styling | **Tailwind CSS v4** + `styles/scenes/*.css` (BEM `tp-*`) | Tokens in `@theme` match the reference; complex illustration CSS reads better as plain CSS |
| Fonts | `next/font/google`: Fraunces, Figtree, Shantell Sans | Self-hosted, no layout shift |
| Animation | **CSS keyframes + small React hooks** (`useInView`, `useScrollProgress`) | Matches the reference and ships no animation library. View Transitions API for the route curtain where supported |
| Data | Typed local content in `content/*.ts` (puppies, gone-home, families, faqs, site config) | No CMS needed for a clone; shape mirrors the reference's CMS object so a CMS could be dropped in later |
| Validation | **Zod** (shared schema client + server) | One schema for both form sides |
| Forms backend | **Next.js Server Action** → validate → honeypot + rate limit → deliver lead | See §6 for delivery. Always falls back to a prefilled `wa.me` link |
| Testing | **Vitest** (unit), **Playwright** (e2e + screenshots at 375 / 768 / 1280 / 1440) | Covers logic, flows, and visual parity |
| Quality | ESLint, Prettier, `tsc --noEmit`, Lighthouse CI | |
| Hosting | **Vercel** (Git integration, preview deploys per PR) | Vercel CLI is already installed; zero-config Next.js |
| Repo | **GitHub** (`gh` CLI is installed) | Required deliverable |

Local environment checked: Node 24.14, npm 10.8, git 2.43, gh 2.97, Vercel CLI present.

---

## 4. Architecture & project structure

```
teddypups/
├─ app/
│  ├─ layout.tsx               # fonts, Header, Footer, Curtain, PupLayer, MobileBar, JSON-LD
│  ├─ page.tsx                 # home: composes scene sections
│  ├─ puppies/
│  │  ├─ page.tsx              # grid + filters (searchParams)
│  │  └─ [slug]/page.tsx       # detail; generateStaticParams + generateMetadata
│  ├─ gone-home/page.tsx
│  ├─ happy-families/page.tsx
│  ├─ how-it-works/page.tsx
│  ├─ faq/page.tsx
│  ├─ contact/page.tsx
│  ├─ actions/enquiry.ts       # "use server" form action
│  ├─ not-found.tsx
│  ├─ sitemap.ts · robots.ts · icon.png · apple-icon.png · opengraph-image
├─ components/
│  ├─ layout/    Header, MobileMenu, Footer, MobileBar, Curtain, PupLayer
│  ├─ scenes/    Hero, MeetHall, TwoWays, ChatJourney, Passport, Dusk, Night, HomeCta
│  ├─ svg/       Teddy, Runner, Door, House, Plane, Phone, Stamp, Skyline, Scallop …
│  ├─ puppies/   PuppyCard, PuppyFilters, Gallery, VideoClip, Ticket, PrevNext
│  ├─ forms/     EnquiryForm, LetterForm, Field
│  └─ ui/        Button, Tag, Chip, Polaroid, Tape, Note
├─ content/      puppies.ts, goneHome.ts, families.ts, faqs.ts, site.ts (phone, email, socials)
├─ lib/          schema.ts (zod), whatsapp.ts (wa.me builder), seo.ts (JSON-LD), filters.ts
├─ hooks/        useInView.ts, useScrollProgress.ts, useReducedMotion.ts
├─ styles/       globals.css (@theme tokens) + scenes/*.css (keyframes per scene)
├─ public/       brand/logo.png, media/** (optimized images, mp4 + posters)
├─ tests/        unit/*.test.ts, e2e/*.spec.ts
├─ PROMPTS.md    log of every AI prompt used (needed for the Loom)
└─ README.md     setup, scripts, architecture, deploy notes
```

**Rendering model**
- Every page is a **Server Component, statically generated** at build time. `generateStaticParams` covers all puppy slugs.
- `/puppies` filters read `searchParams`. A small client `PuppyFilters` updates the URL with `router.replace`, so links like `/puppies?breed=poodle` work.
- **Client components only where needed:** MobileMenu, Curtain, PupLayer, MeetHall (scroll), ChatJourney (sequenced messages), Gallery, forms, FAQ search/accordion.
- Images go through `next/image` with `placeholder="blur"` (blurDataURL generated at build) and `object-position` taken from the reference's `focalX/focalY`.

---

## 5. Key implementation approaches (the hard parts)

1. **Meet-the-pups hall (scroll-pinned horizontal track).** The section height is about `100vh + track width`. `.tp-meet__stage` uses `position: sticky`. `useScrollProgress` maps scroll to `translateX` on `.tp-meet__track` through a rAF loop. Each door gets a CSS var `--open` (0→1) that drives `tp-door-open` (3D `rotateY` on the leaf). The mascot sits fixed in the stage and bobs. On mobile or with reduced motion it becomes a normal horizontal snap-scroll row.
2. **Route curtain transition.** A client `Curtain` intercepts internal link navigation. It plays `tp-curtain-cover` (blanket drops, runner dog crosses, paw prints appear), then `router.push`, then `tp-curtain-lift` once the new path renders. Back/forward is handled, and reduced motion skips it.
3. **Scroll mascot + paw prints.** A fixed `pup-layer` puppy follows scroll progress. `pup-prints` positions about 24 absolutely placed paw SVGs along a zig-zag path over the full document height and reveals them as the viewport passes.
4. **SVG illustration set.** Rebuild each scene as a React SVG component with class hooks for the keyframes (runner legs/tail/ear, plane bob, sun/moon, twinkle stars, stamp thump). Match proportions from screenshots side by side, scene by scene.
5. **Chat journey.** An IntersectionObserver per step sets `data-active` on that step. Phone messages for the active step animate in (`tp-msg-in`), with a typing indicator (`tp-dot`) shown before each "them" message.
6. **Responsiveness.** Breakpoints match the reference (Tailwind `sm/md/lg/xl`). Check each scene at 375, 768, 1024, 1280 and 1440 px against reference screenshots.
7. **Accessibility.** SVGs get `role="img"` and `aria-label` (as the reference does), plus skip link, focus-visible rings, labelled form fields, `aria-live` form status, keyboard-operable gallery and menu, and full `prefers-reduced-motion` support.

---

## 6. Forms & lead handling

- **Shared Zod schema:** `name` (required), `phone` (required, international format), `email` (optional, valid), `area`, `message`, `puppyId` (optional), `website` (honeypot, must be empty).
- **Client:** inline validation messages in the site's hand-drawn style, disabled button while submitting, success state (the letter folds into an envelope, gets stamped, and is "posted" with `tp-letter-fold`, `tp-env-post`, `tp-stamp-in`).
- **Server Action:** re-validates input, silently accepts and drops honeypot hits, applies a basic per-IP rate limit, then delivers the lead.
- **Lead delivery:** the reference does not show where leads go. When the forms are built, I'll pick a real email or storage provider through the Vercel Marketplace flow so the form really delivers. The success screen always includes a "Continue on WhatsApp" link with the enquiry prefilled (`wa.me/971541676733?text=…`), which matches the site's WhatsApp-first flow.

---

## 7. Assets

- Download the reference's puppy photos, videos and logo from the public `/media/*` and `/brand/logo.png` paths into `public/` with a small Node script (`scripts/fetch-media.mjs`). Re-encode to WebP/AVIF, generate posters for MP4s, and produce blur placeholders with `sharp`.
- Hand-rebuild all illustrations as SVG. Don't hot-link anything from the reference domain.
- Favicons and OG image are generated with `app/icon.png` and `opengraph-image.tsx`.
- *Note:* the images belong to the reference demo site and are used only because the assignment asks for a clone. The README says so.

---

## 8. Testing strategy

| Type | Tool | What |
|---|---|---|
| Unit | Vitest | zod schema (valid/invalid/honeypot), `filters.ts` (breed/origin query parsing), `whatsapp.ts` link builder, prev/next pup logic |
| E2E | Playwright | nav to every route; mobile menu open/close; filters update URL and grid; puppy gallery next/prev + video play; enquiry form validation → success; contact letter form; FAQ search filters notes; 404 page |
| Visual parity | Playwright screenshots | Same pages captured on the reference and the clone at 375/768/1280, compared side by side (manual review plus optional pixel diff) |
| A11y | `@axe-core/playwright` | Zero serious/critical violations per page |
| Perf/SEO | Lighthouse (local + on the deployed URL) | Targets: Perf ≥ 90 mobile, A11y ≥ 95, SEO 100 |
| Manual | Real devices / DevTools | iOS Safari, Android Chrome, Firefox; reduced-motion on |

`npm run check` = lint + typecheck + unit tests, run before every push.

---

## 9. Deployment

1. `git init`, push to a public GitHub repo with `gh repo create teddypups-clone --public`.
2. Import into Vercel (Git integration), framework auto-detected, Node 24.
3. Add form-delivery env vars to Vercel (Preview + Production), then `vercel env pull` locally.
4. Every push to a branch gets a preview URL. Merging to `main` deploys to production.
5. After deploy: run Playwright e2e against the production URL, run Lighthouse, and test the forms end to end.
6. Optional: custom domain.

---

## 10. Timeline (48 h)

| Block | Hours | Output |
|---|---|---|
| **0. Setup** | 0–2 | Repo, Next.js + Tailwind v4 + fonts + tokens, Vercel project linked, first deploy, `PROMPTS.md` started |
| **1. Content & assets** | 2–5 | `content/*.ts` with all puppies/tickets/families/FAQs, media fetched and optimized |
| **2. Layout shell** | 5–9 | Header + paw indicator, mobile menu, footer, mobile bar, button/tag/polaroid primitives |
| **3. Inner pages (static)** | 9–17 | `/puppies` + filters, `/puppies/[slug]` + gallery, `/gone-home`, `/happy-families`, `/faq`, `/how-it-works`, `/contact` |
| **4. Forms** | 17–20 | Schema, server action, lead delivery, letter/envelope success states |
| **5. Home scenes** | 20–32 | Hero, Meet hall (scroll), Two ways (plane), Chat journey, Passport, Dusk, Night, Home CTA, plus all SVG illustrations |
| **6. Global motion** | 32–36 | Route curtain + runner, scroll mascot + paw prints, reveal-on-scroll, reduced-motion pass |
| **7. Responsive & polish** | 36–41 | Side-by-side parity at all breakpoints, a11y fixes, SEO/JSON-LD/sitemap |
| **8. Test & deploy** | 41–44 | Playwright + axe + Lighthouse on prod, bug fixes |
| **9. Docs & Loom** | 44–47 | README, PROMPTS.md final, record Loom (~10 min) |
| **Buffer / submit** | 47–48 | Email with subject `Technical Assignment Submission – [Full Name] – Insta Biz Web` |

**Priority if time runs short:** all pages working and responsive come first, then forms, home scenes, global motion, and finally pixel polish. Animations degrade gracefully, so a missing animation never breaks a page.

---

## 11. Loom video outline (~10 min)

1. Demo the live site on desktop and mobile (1.5 min)
2. Recon: how I analysed the reference (HTML/CSS/RSC payload, tokens, sitemap) (1 min)
3. Stack and why; project structure walkthrough (2 min)
4. Hard parts in code: Meet hall scroll, curtain transition, SVG scenes, form action (2.5 min)
5. AI tools used plus the exact prompts, read from `PROMPTS.md` (1.5 min)
6. Challenges and trade-offs (1 min)
7. Testing (Playwright run, Lighthouse) and deployment (Vercel pipeline) (1 min)

---

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Illustration work eats the timeline | Build the static layout first, then the SVGs simplest-first, with timeboxes per scene |
| Scroll-pinned hall janky on mobile | rAF with transform-only updates, `will-change`, and a snap-scroll fallback below `md` |
| Curtain transition breaks navigation or back button | Feature flag; falls back to a plain Next.js transition |
| Form spam | Honeypot + rate limit + server-side validation |
| Large media slows the page | WebP/AVIF, `sizes`, lazy loading, blur placeholders, posters for video, `preload="none"` |
| Deadline | Hour-based plan above with a priority order and a 1 h buffer |
