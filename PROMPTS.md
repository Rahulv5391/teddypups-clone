# AI prompts log

The assignment requires sharing the AI tools used and the exact prompts given.
This file records every prompt in order, with a short note on what the AI did in response.

**AI tool:** Claude Code (Anthropic), model Claude Opus 5.5, with the Claude in Chrome browser extension.

---

## Session 1 — Planning, reference capture, project setup (2026-11-02)

### Prompt 1
> I have this assignment : *[pasted the full assignment email from Insta Biz Web]* , create a plan.md to plan out completely how will we build it. include architecthute technologies and other necessary things. you can use clayude in chrom eif you feel liek using a browser

**What the AI did:** Downloaded the reference site's HTML, CSS, sitemap and robots.txt with `curl`. It worked out the stack (Next.js App Router plus Tailwind v4), the design tokens (colours, fonts, easings), the CMS data shape of a puppy, the form fields (including a honeypot) and the JSON-LD. It used Claude in Chrome to inspect the scroll-driven sections. Then it wrote `plan.md`: architecture, stack, page inventory, hard parts, testing, deployment and a 48-hour timeline.

### Prompt 2
> Use claude in chrome , visit each page of the webiste and take screenshots of each page so that you have a reference of the design , css etc. Store the screenshots in this directory under screenshots folder

**What the AI did:** Captured the home page as 18 viewport screenshots with Claude in Chrome. On `/puppies` the Chrome screenshot command kept timing out, and the browser window couldn't be resized beyond the laptop screen. The AI reported this and asked how to continue.

### Prompt 3 (answer to the AI's question)
> Playwright (Recommended)

**What the AI did:** Wrote a Playwright script (`scripts/capture-screenshots.mjs`) that scrolls through each page so lazy images and scroll animations load, then takes full-page screenshots at 1440, 1280, 768 and 375px. It also saves viewport slices of the home page and the open mobile menu. Result: 99 screenshots in `screenshots/`.

### Prompt 4
> are we read to start ?

**What the AI did:** Checked the toolchain and logins (GitHub CLI, Vercel CLI), then asked two things: whether the 48-hour clock had started, and what to name the repo.

### Prompt 5
> yes to both, start now

**What the AI did:** Block 0 of the plan:
- Scaffolded Next.js 16 with TypeScript, Tailwind v4 and ESLint.
- Copied the reference's exact design tokens into `globals.css`.
- Loaded Fraunces, Figtree and Shantell Sans with the same variable-font axes as the reference.
- Added the brand assets (logo, favicons, paw cursors) and site constants.
- Created this log and the README.
- Created the public GitHub repo `Rahulv5391/teddypups-clone` and pushed.
- Started the Vercel deploy. It needed a newer CLI, so the AI ran the latest version through `npx` instead of upgrading the global install.

### Prompt 6 (sent while the deploy was running)
> which vercel account are we using, the email should be rahul@nebula9.ai

**What the AI did:** Found the CLI was signed in to a different, personal Vercel account, where the first deploy had gone. It removed the local link to that project and asked how to proceed.

### Prompt 7
> delete the project, i ll login with the correct vercel account

**What the AI did:** Confirmed the project was the one created that day, deleted only `teddypups-clone` from the wrong account (the URL now returns 404), and left the account's other projects alone.

### Prompt 8
> done

**What the AI did:**
- Checked through the Vercel API that the CLI is now signed in as `rahul@nebula9.ai`.
- Linked the project to that team and connected the GitHub repo.
- Pushed to `main`, which started a production deploy automatically, and confirmed it reached Ready.
- Smoke-checked the live URL and found the social-share image URL pointed at `localhost`. It fixed this by falling back to Vercel's production-domain variable, then redeployed and verified.

## Session 1, continued — Block 1: content & assets

### Prompt 9
> yes please go ahead

**What the AI did:**
- Found that the reference embeds its CMS data in the Next.js server-component payload of each page. It wrote `scripts/extract-content.mjs` to decode that payload and extract 42 puppies (15 available, 27 gone home), 64 family photos, the testimonial, 9 FAQs and the 8-breed list. The script also downloads all 205 referenced media files (about 73 MB).
- Read the reference's client JavaScript bundle to copy its exact puppy-filter rules: URL parameters `origin`, `breed`, `gender` and `collection`; a boy-and-girl litter matching both genders; chips shown only when a puppy can match them. It also took the labels and empty-state copy from there.
- Fixed two extraction bugs found while checking the output. Some gone-home puppies got the page title as their gender, so gender now comes from the ticket text. The home page sometimes streamed an incomplete payload, so the script now retries.
- Upgraded `@types/node` to 24 so Vitest 5 would install, then added 11 unit tests for content integrity, filters and previous/next navigation.
- Confirmed `next/image` serves the AVIF/JPEG/WebP sources (a 3.3 MB JPEG becomes 41 KB) and that video range requests work on the live deploy.

## Block 2: layout shell

### Prompt 10
> Yes

**What the AI did:**
- Pulled the reference's header, mobile menu and footer markup, plus the matching CSS rules (with a small extractor that keeps `@media` context). It ported them into `app/styles/layout.css` with the same values.
- Read the reference's client code for exact behaviour:
  - The header counts as scrolled after 8px, hides when scrolling down past 220px (only for moves over 6px), and reappears on keyboard focus.
  - The menu is a `<dialog>` with an animated close.
  - Nav links are active on their own path and all sub-paths.
- Found that the mascot Teddy is generated from code: fluffy-ellipse outlines, 12 named poses, and a solver that turns a pose into SVG transforms. It ported this to `lib/teddy/geometry.ts` and added unit tests asserting the output is identical to the reference SVG.
- Fixed a Next 16 build error (`new Date()` isn't allowed during prerender) by computing the copyright year in a `"use cache"` component.
- Compared reference and clone screenshots side by side for the header (home, scrolled, inner page), mobile header, open menu, and desktop and mobile footers. All matched.
- Noted two global effects for block 6: the cursor paw-print trail and the route-transition curtain.
