// Captures reference screenshots of a site.
// Usage: node capture.mjs <baseUrl> <outDir>
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.argv[2] ?? 'https://puppy.instabizweb.com';
const OUT = process.argv[3] ?? './screenshots';

const PAGES = [
  ['01-home', '/'],
  ['02-puppies', '/puppies'],
  ['03-puppies-filter-poodle', '/puppies?breed=poodle'],
  ['04-puppies-filter-imported', '/puppies?origin=imported'],
  ['05-puppy-detail-available', '/puppies/maltipoo-max-male'],
  ['06-puppy-detail-gone-home', '/puppies/pomeranian-ace-boy'],
  ['07-gone-home', '/gone-home'],
  ['08-happy-families', '/happy-families'],
  ['09-how-it-works', '/how-it-works'],
  ['10-faq', '/faq'],
  ['11-contact', '/contact'],
  ['12-not-found', '/this-page-does-not-exist'],
];

const VIEWPORTS = [
  { name: '1440-desktop', width: 1440, height: 900 },
  { name: '1280-laptop', width: 1280, height: 800 },
  { name: '768-tablet', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: '375-mobile', width: 375, height: 812, isMobile: true, hasTouch: true },
];

// Pages that also get viewport-by-viewport slices (scroll-driven scenes)
const SLICE_PAGES = new Set(['01-home']);
const SLICE_VIEWPORTS = new Set(['1440-desktop', '375-mobile']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function settle(page) {
  // Walk the page so IntersectionObserver reveals + lazy images fire.
  const vh = page.viewportSize().height;
  let y = 0;
  for (let i = 0; i < 200; i++) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    if (y > h) break;
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await sleep(250);
    y += Math.round(vh * 0.8);
  }
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; setTimeout(r, 5000); }),
      ),
    );
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await sleep(1200);
}

async function slices(page, dir, name) {
  const vh = page.viewportSize().height;
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const max = h - vh;
  let n = 1;
  for (let y = 0; ; y += vh) {
    const top = Math.min(y, max);
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), top);
    await sleep(900);
    await page.screenshot({ path: path.join(dir, `${name}-${String(n++).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 85 });
    if (top >= max) break;
  }
}

const browser = await chromium.launch();
const log = [];
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.hasTouch,
    userAgent: vp.isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const page = await ctx.newPage();
  const fullDir = path.join(OUT, 'full-page', vp.name);
  await fs.mkdir(fullDir, { recursive: true });

  for (const [name, route] of PAGES) {
    try {
      await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
      await sleep(1500);
      await settle(page);
      const file = path.join(fullDir, `${name}.jpg`);
      await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 85 });
      log.push(`ok   ${vp.name} ${name}`);

      if (SLICE_PAGES.has(name) && SLICE_VIEWPORTS.has(vp.name)) {
        const sliceDir = path.join(OUT, 'sections', `${name}-${vp.name}`);
        await fs.mkdir(sliceDir, { recursive: true });
        await slices(page, sliceDir, name);
        log.push(`ok   ${vp.name} ${name} slices`);
      }
    } catch (e) {
      log.push(`FAIL ${vp.name} ${name}: ${e.message.split('\n')[0]}`);
    }
  }

  // Interaction state: mobile menu open
  if (vp.width < 1024) {
    try {
      const stateDir = path.join(OUT, 'states');
      await fs.mkdir(stateDir, { recursive: true });
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await sleep(1500);
      await page.getByRole('button', { name: /menu/i }).first().click();
      await sleep(1200);
      await page.screenshot({ path: path.join(stateDir, `mobile-menu-open-${vp.name}.jpg`), type: 'jpeg', quality: 85 });
      log.push(`ok   ${vp.name} mobile-menu`);
    } catch (e) {
      log.push(`FAIL ${vp.name} mobile-menu: ${e.message.split('\n')[0]}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(log.join('\n'));
