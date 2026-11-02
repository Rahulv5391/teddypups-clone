// Extracts content + media from the reference site into content/data/*.json and public/media/.
//
// The reference is a Next.js App Router site, so each page embeds its server-component
// payload ("RSC flight data") in self.__next_f.push([...]) script tags. We decode that
// payload and pull out the same structured objects the original pages render from.
//
// Usage: node scripts/extract-content.mjs [baseUrl]
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.argv[2] ?? 'https://puppy.instabizweb.com';
const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_DIR = path.join(ROOT, 'content', 'data');
const PUBLIC_DIR = path.join(ROOT, 'public');
const UA = 'Mozilla/5.0 (TeddyPups clone content extractor)';

// ---------- helpers ----------
async function getHtml(route) {
  const res = await fetch(BASE + route, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${route} -> HTTP ${res.status}`);
  return res.text();
}

/** Concatenate all RSC flight chunks embedded in the HTML. */
function decodeRsc(html) {
  let out = '';
  const re = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g;
  let m;
  while ((m = re.exec(html))) out += JSON.parse(m[1]);
  return out;
}

/** Find `"key":[...]` (or `{...}`) in a string and JSON.parse the balanced value. */
function grab(s, key, open = '[', from = 0) {
  const close = open === '[' ? ']' : '}';
  const needle = `"${key}":${open}`;
  const i = s.indexOf(needle, from);
  if (i < 0) return null;
  let depth = 0, inStr = false, esc = false, j = i + needle.length - 1;
  for (; j < s.length; j++) {
    const c = s[j];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) break;
  }
  return JSON.parse(s.slice(i + needle.length - 1, j + 1));
}

/** Text value that follows a label node, e.g. "Breed" -> "Pomeranian". */
function fieldAfter(rsc, label) {
  const re = new RegExp(`"children":"${label}"\\}\\],\\["\\$","dd",null,\\{[^{}]*"children":"([^"]*)"`);
  const m = rsc.match(re);
  if (m) return m[1];
  // fallback: next plain text child after the label
  const i = rsc.indexOf(`"children":"${label}"`);
  if (i < 0) return '';
  const n = rsc.slice(i + label.length + 14).match(/"children":"([^"$][^"]*)"/);
  return n ? n[1] : '';
}

const pool = async (items, size, fn) => {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k], k);
      }
    }),
  );
  return out;
};

const MEDIA_RE = /\/media\/[A-Za-z0-9_-]+\/[a-f0-9]+\/[A-Za-z0-9_.-]+\.(?:jpe?g|webp|avif|png|gif|mp4|webm|mov)/g;

// ---------- 1. available puppies ----------
console.log('Fetching /puppies …');
const puppiesRsc = decodeRsc(await getHtml('/puppies'));
const available = grab(puppiesRsc, 'puppies');
// The filter component receives the full breed list as a separate prop (the longest "breeds" array).
const breeds = [...puppiesRsc.matchAll(/"breeds":(\[\{"slug"[^\]]*\])/g)]
  .map((m) => JSON.parse(m[1]))
  .sort((a, b) => b.length - a.length)[0];
console.log(`  ${available.length} available puppies, ${breeds.length} breeds`);
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- 2. gone-home puppies ----------
console.log('Fetching /gone-home …');
const goneHtml = await getHtml('/gone-home');
const goneRsc = decodeRsc(goneHtml);
const goneSlugs = [...new Set([...goneRsc.matchAll(/"href":"\/puppies\/([a-z0-9-]+)","className":"tp-ticket__link"/g)].map((m) => m[1]))];
const ticketRoutes = Object.fromEntries(
  [...goneRsc.matchAll(/"href":"\/puppies\/([a-z0-9-]+)","className":"tp-ticket__link".*?"tp-ticket__route","children":\[\["\$","span",null,\{"children":"([^"]+)"/g)].map((m) => [m[1], m[2]]),
);
const ticketMeta = Object.fromEntries(
  [...goneRsc.matchAll(/"href":"\/puppies\/([a-z0-9-]+)","className":"tp-ticket__link".*?"tp-ticket__meta","children":"([^"]+)"/g)].map((m) => [m[1], m[2]]),
);
console.log(`  ${goneSlugs.length} gone-home slugs, ${Object.keys(ticketMeta).length} ticket labels`);

const gone = await pool(goneSlugs, 4, async (slug, idx) => {
  const rsc = decodeRsc(await getHtml(`/puppies/${slug}`));
  const media = grab(rsc, 'media') ?? [];
  const name = (rsc.match(/"aria-current":"page","children":"([^"]+)"/) ?? [])[1] ?? slug;
  // Ticket meta is always present ("Pomsky, boy" or "Pomeranian Boy"); the detail page's
  // "Boy or girl" row is missing for some puppies, so the ticket is the source of truth.
  const meta = ticketMeta[slug] ?? '';
  const breed = fieldAfter(rsc, 'Breed') || meta.split(/,|\s(?=boy|girl)/i)[0].trim();
  const genderLabel = /girl/i.test(meta) ? 'Girl' : /boy/i.test(meta) ? 'Boy' : fieldAfter(rsc, 'Boy or girl');
  const age = fieldAfter(rsc, 'Age');
  const where = fieldAfter(rsc, 'Where');
  const originSlug = /showroom|dubai/i.test(where) ? 'local' : 'imported';
  return {
    id: `gone-${slug}`,
    slug,
    name,
    displayName: name,
    breed,
    gender: /girl/i.test(genderLabel) ? 'female' : 'male',
    genderLabel,
    age,
    colour: '',
    description: '',
    status: 'rehomed', // same status name the reference CMS uses
    origin: { slug: originSlug, name: originSlug === 'local' ? 'In Dubai' : 'Imported' },
    breeds: [{ slug: slugify(breed), name: breed }],
    collections: [],
    ticketFrom: ticketRoutes[slug] ?? (originSlug === 'local' ? 'Dubai showroom' : 'TeddyPups'),
    order: idx,
    cover: media[0] ?? null,
    media,
  };
});

// ---------- 3. happy families, testimonial, FAQs ----------
console.log('Fetching /happy-families, /faq, / …');
const familiesRsc = decodeRsc(await getHtml('/happy-families'));
// The home page occasionally streams an incomplete payload, so retry until it has what we need.
let homeHtml = '', homeRsc = '';
for (let attempt = 1; attempt <= 4; attempt++) {
  homeHtml = await getHtml('/');
  homeRsc = decodeRsc(homeHtml);
  if (homeRsc.includes('"testimonial":{') && homeRsc.includes('"photos":[')) break;
  console.warn(`  home payload incomplete (attempt ${attempt}), retrying …`);
}
const familyPhotos = grab(familiesRsc, 'photos');
const homePhotos = grab(homeRsc, 'photos') ?? [];
const captions = Object.fromEntries(homePhotos.filter((p) => p.caption).map((p) => [p.id, p.caption]));
for (const p of familyPhotos) if (!p.caption && captions[p.id]) p.caption = captions[p.id];
const testimonial = grab(homeRsc, 'testimonial', '{');
if (!testimonial) throw new Error('Testimonial not found on home page');
const faqs = grab(decodeRsc(await getHtml('/faq')), 'faqs');

// ---------- 4. normalise available puppies ----------
// Drop CMS-only fields the clone never renders.
const strip = (p) => {
  const out = { ...p, collections: p.collections.map(({ slug, name }) => ({ slug, name })) };
  for (const k of ['published', 'records', 'featured']) delete out[k];
  return out;
};
const puppies = [
  ...available.map((p, i) => ({ ...strip(p), order: i })),
  ...gone,
];

// ---------- 5. write data ----------
await fs.mkdir(DATA_DIR, { recursive: true });
const write = (file, data) => fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2) + '\n');
await write('puppies.json', puppies);
await write('families.json', { testimonial, photos: familyPhotos });
await write('faqs.json', faqs);
await write('breeds.json', breeds);

// ---------- 6. download every media file referenced anywhere ----------
const pages = ['/', '/puppies', '/gone-home', '/happy-families', '/how-it-works', '/faq', '/contact'];
const urls = new Set();
const scan = (s) => { for (const m of s.matchAll(MEDIA_RE)) urls.add(m[0]); };
scan(JSON.stringify(puppies));
scan(JSON.stringify(familyPhotos));
scan(homeHtml);
scan(goneHtml);
for (const route of ['/how-it-works', '/contact', '/faq']) scan(await getHtml(route));
console.log(`Downloading ${urls.size} media files …`);

let bytes = 0, skipped = 0;
await pool([...urls], 6, async (url) => {
  const dest = path.join(PUBLIC_DIR, url);
  try {
    const stat = await fs.stat(dest);
    if (stat.size > 0) { skipped++; bytes += stat.size; return; }
  } catch {}
  const res = await fetch(BASE + url, { headers: { 'user-agent': UA } });
  if (!res.ok) { console.warn(`  ! ${url} -> ${res.status}`); return; }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
  bytes += buf.length;
});

console.log(`Done.
  puppies:        ${puppies.length} (${available.length} available, ${gone.length} gone home)
  family photos:  ${familyPhotos.length} (${familyPhotos.filter((p) => p.caption).length} captioned)
  faqs:           ${faqs.length}
  testimonial:    ${testimonial ? testimonial.author : 'missing'}
  media:          ${urls.size} files, ${(bytes / 1e6).toFixed(1)} MB (${skipped} already present)
  pages scanned:  ${pages.length}`);
