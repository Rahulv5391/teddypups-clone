/**
 * Hand-drawn "sketchbook" frames for puppy cards — ported from the reference site.
 *
 * Everything is derived from a seeded PRNG keyed on the puppy slug, so each puppy always gets
 * the same wobbly frame: a blob mask for the photo, an ink outline, a partial "retrace" stroke,
 * a colour wash offset behind it, a slight tilt and 2–3 doodles around the edge.
 */

const f2 = (n: number) => n.toFixed(2);

/** FNV-1a hash of the string → seed for a mulberry32-style generator returning [0, 1). */
export function seeded(str: string): () => number {
  let h = 0x811c9dc5;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 0x1000193);
  let state = h >>> 0;
  return () => {
    let t = (state = (state + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

type Point = [number, number];

/** Points on a wobbly circle around (50,50) in a 100×100 box. */
function wobble(rand: () => number, radius: number, amp: number, count = 40, start = 0, sweep = Math.PI * 2): Point[] {
  const phase = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
  const squash = 1 + (rand() - 0.5) * 0.05;
  const pts: Point[] = [];
  for (let i = 0; i < count; i++) {
    const a = start + (i / (sweep >= Math.PI * 2 ? count : count - 1)) * sweep;
    const r = radius + amp * (0.55 * Math.sin(2 * a + phase[0]) + 0.3 * Math.sin(3 * a + phase[1]) + 0.15 * Math.sin(5 * a + phase[2]));
    pts.push([50 + Math.cos(a) * r * squash, 50 + (Math.sin(a) * r) / squash]);
  }
  return pts;
}

/** Catmull-Rom spline through the points as cubic Béziers. */
function smooth(pts: Point[], closed: boolean): string {
  const n = pts.length;
  const at = (i: number) => pts[closed ? (i + n) % n : Math.min(n - 1, Math.max(0, i))];
  let d = `M${f2(pts[0][0])} ${f2(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f2(c1[0])} ${f2(c1[1])} ${f2(c2[0])} ${f2(c2[1])} ${f2(p2[0])} ${f2(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

const WASHES = ["#f2be6b", "#f9cdbf", "#bfddf5", "#fbe3b4", "#e8c39a"];
const INKS = ["#c2622b", "#a24a1a", "#2a170e", "#d4893f"];
const KINDS = ["sparkle", "heart", "dashes", "swirl", "dots", "paw"] as const;

export type DoodleKind = (typeof KINDS)[number];
export type Doodle = { kind: DoodleKind; x: number; y: number; rot: number; size: number; ink: string };
export type Sketch = {
  mask: string;
  outline: string;
  retrace: string;
  wash: { d: string; dx: number; dy: number; color: string };
  tilt: number;
  doodles: Doodle[];
};

export function sketchFor(slug: string): Sketch {
  const rand = seeded(slug);
  const mask = smooth(wobble(rand, 45.5, 2.6), true);
  const outline = smooth(wobble(rand, 47.8, 3.1), true);
  const start = rand() * Math.PI * 2;
  const retrace = smooth(wobble(rand, 49, 3.4, 30, start, Math.PI * (1.15 + 0.5 * rand())), false);
  const wash = {
    d: smooth(wobble(rand, 46.5, 3.6), true),
    dx: (rand() - 0.5) * 9,
    dy: 3 + 4 * rand(),
    color: WASHES[Math.floor(rand() * WASHES.length)],
  };
  const tilt = (rand() - 0.5) * 5;

  // Doodles sit in up to three arcs around the frame (in random order).
  const arcs = [
    [0.86, 1.08],
    [1.16, 1.42],
    [-0.08, 0.16],
  ]
    .map((z) => ({ z, k: rand() }))
    .sort((a, b) => a.k - b.k)
    .map((e) => e.z);
  const count = 2 + Math.floor(rand() * 2);
  const doodles: Doodle[] = [];
  const used = new Set<DoodleKind>();
  for (let i = 0; i < count; i++) {
    let kind = KINDS[Math.floor(rand() * KINDS.length)];
    if (used.has(kind)) kind = KINDS.find((k) => !used.has(k))!;
    used.add(kind);
    const [lo, hi] = arcs[i];
    const angle = Math.PI * (lo + rand() * (hi - lo));
    const dist = 55 + rand() * 4;
    doodles.push({
      kind,
      x: 50 + Math.cos(angle) * dist,
      y: 50 + Math.sin(angle) * dist,
      rot: (rand() - 0.5) * 50,
      size: 0.85 + rand() * 0.35,
      ink: INKS[Math.floor(rand() * INKS.length)],
    });
  }
  return { mask, outline, retrace, wash, tilt, doodles };
}

/** CSS mask-image for the photo blob. */
export function maskUrl(d: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
