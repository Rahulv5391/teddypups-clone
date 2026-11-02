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
- Created the GitHub repo and deployed to Vercel.
