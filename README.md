# TeddyPups U.A.E. — clone

A clone of [puppy.instabizweb.com](https://puppy.instabizweb.com/), built for the Insta Biz Web technical assignment.

- **Live site:** https://teddypups-clone-smoky.vercel.app
- **Plan & architecture:** [`plan.md`](./plan.md)
- **AI prompts used:** [`PROMPTS.md`](./PROMPTS.md)
- **Reference screenshots:** [`screenshots/`](./screenshots)

## Stack

Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS v4 · `next/font` (Fraunces, Figtree, Shantell Sans) · CSS keyframe animations and inline SVG illustrations · deployed on Vercel.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck
npm run build      # production build
```

Requires Node.js 22 or newer.

## Project structure

```
app/         routes, layout, global styles, icons
content/     site constants and typed content (puppies, FAQs, families…)
public/      brand assets, cursors, media
scripts/     tooling (reference screenshot capture)
screenshots/ reference screenshots of the original site
```

## Credits

Photos, videos, logo and copy belong to the original TeddyPups demo site. They are used here only because the assignment asks for a clone of that site.
