/**
 * Teddy, the TeddyPups mascot — geometry, colours, poses and the pose → SVG-transform solver.
 *
 * Ported from the reference site's mascot module. Every outline is a "fluffy" ellipse: an
 * ellipse traced with quadratic bumps, which gives the plush, poodle-like silhouette.
 * Poses are plain numbers, so they can be interpolated (`mixPose`) and animated frame by frame.
 */

export const VIEW_W = 300;
export const VIEW_H = 240;
export const GROUND_Y = 228;
export const EYE_Y = 98;

export const colors = {
  ink: "#2a170e",
  fur: "#f2be6b",
  furShade: "#e4a352",
  cream: "#fbe3b4",
  blush: "#f9b9a6",
  collar: "#a24a1a",
} as const;

type Pt = readonly [number, number];

/** Pivot points (in the 300×240 viewBox). */
export const pivots = {
  body: [196, 206] as Pt,
  head: [212, 100] as Pt,
  shoulderNear: [186, 194] as Pt,
  shoulderFar: [168, 192] as Pt,
  hipNear: [110, 194] as Pt,
  hipFar: [94, 192] as Pt,
  tailBase: [84, 150] as Pt,
  earL: [174, 82] as Pt,
  earR: [250, 82] as Pt,
};

/**
 * Ellipse outline with `bumps` quadratic scallops.
 * @param cx,cy centre  @param rx,ry radii  @param fluff bump height
 * @param start angle of the first bump  @param tiltDeg rotation of the whole ellipse
 */
function fluffy(cx: number, cy: number, rx: number, ry: number, bumps: number, fluff: number, start = -Math.PI / 2, tiltDeg = 0): string {
  const tilt = (tiltDeg * Math.PI) / 180;
  const at = (angle: number, grow: number) => {
    const x = Math.cos(angle) * (rx + grow);
    const y = Math.sin(angle) * (ry + (ry / rx) * grow);
    return `${(cx + x * Math.cos(tilt) - y * Math.sin(tilt)).toFixed(1)} ${(cy + x * Math.sin(tilt) + y * Math.cos(tilt)).toFixed(1)}`;
  };
  let d = "";
  for (let i = 0; i < bumps; i++) {
    const a0 = start + (i / bumps) * Math.PI * 2;
    const a1 = start + ((i + 1) / bumps) * Math.PI * 2;
    const mid = (a0 + a1) / 2;
    d += `${i === 0 ? `M${at(a0, 0)}` : ""}Q${at(mid, fluff * 2.1)} ${at(a1, 0)}`;
  }
  return `${d}Z`;
}

export const paths = {
  body: fluffy(140, 170, 64, 36, 15, 3.4, Math.PI * 0.95),
  chest: fluffy(192, 166, 30, 32, 9, 3.2, Math.PI * 0.6),
  tail: fluffy(70, 126, 17, 16, 9, 3.2),
  tailStem: "M86 152 C80 146 76 140 74 136",
  haunch: fluffy(110, 204, 30, 24, 10, 3.2, Math.PI),
  haunchPaw: "M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z",
  head: fluffy(212, 100, 51, 46, 16, 3.6),
  topknot: fluffy(212, 52, 17, 12, 8, 2.9, Math.PI),
  earL: fluffy(170, 112, 19, 34, 10, 3.2, -Math.PI / 2, 12),
  earR: fluffy(254, 112, 19, 34, 10, 3.2, -Math.PI / 2, -12),
  muzzle: "M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z",
  nose: "M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z",
  mouth: "M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2",
  mouthOpen: "M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z",
  tongue: "M207.6 127.4 Q212 136.6 216.4 127.4 Z",
  collar: "M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z",
  tag: "M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z",
  ledgePaws: "M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z",
  ledgeToes: "M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5",
  happyEyes: "M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101",
  shutEyes: "M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97",
  mouthOpenTongue: "M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z",
  haunchToes: "M132 222v5M139 222v5",
};

export const shadow = { cx: 150, cy: 230, rx: 92, ry: 7 };

/** Leg outline: `width` at the hip/shoulder, reaching down `length`. Drawn from a local origin. */
function leg(width: number, length: number): string {
  const h = width / 2;
  return `M${-h} -14 C${-h} 4 -12 ${length - 18} -12 ${length - 9} C-12 ${length - 2} -7 ${length} 0 ${length} C9 ${length} 13 ${length - 3} 13 ${length - 9} C13 ${length - 18} ${h} 4 ${h} -14`;
}

export const legs = {
  front: leg(24, GROUND_Y - pivots.shoulderNear[1]),
  frontFar: leg(22, GROUND_Y - pivots.shoulderFar[1]),
  back: leg(30, GROUND_Y - pivots.hipNear[1]),
  backFar: leg(28, GROUND_Y - pivots.hipFar[1]),
};

/** Toe lines at the bottom of a leg of the given length. */
export const toes = (length: number) => `M-3.5 ${length - 7} v5 M4.5 ${length - 7} v5`;

// ---------- poses ----------

export type Pose = {
  bodyRot: number; bodyX: number; bodyY: number; stretch: number;
  headX: number; headY: number; headRot: number;
  earL: number; earR: number; tail: number;
  /** leg rotations: front-near, front-far, back-near, back-far */
  fn: number; ff: number; bn: number; bf: number;
  /** 1 = sitting (back legs hidden, haunch shown) */
  sit: number;
  /** 1 = eyes open, 0 = shut */
  eyes: number;
  happy: number; tongue: number; mouth: number;
  /** 1 = front view, paws on a ledge (peeking) */
  front: number;
};

const base: Pose = {
  bodyRot: 0, bodyX: 0, bodyY: 0, stretch: 1, headX: 0, headY: 0, headRot: 0, earL: 0, earR: 0,
  tail: 0, fn: 0, ff: 0, bn: 0, bf: 0, sit: 0, eyes: 1, happy: 0, tongue: 0, mouth: 0, front: 0,
};

export const poses = {
  stand: base,
  walk: { ...base, tail: -6, tongue: 1 },
  sit: { ...base, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...base, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...base, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1, tongue: 0 },
  lie: { ...base, bodyRot: -5, bodyY: 22, headX: 12, headY: 40, headRot: 3, fn: -84, ff: -80, sit: 1, tail: 58, tongue: 0 },
  sleep: { ...base, bodyRot: -5, bodyY: 22, headX: 14, headY: 44, headRot: -8, fn: -84, ff: -80, sit: 1, tail: 64, eyes: 0, earL: 4, earR: -4 },
  settle: { ...base, bodyRot: -5, bodyY: 22, headX: 10, headY: 16, fn: -84, ff: -80, sit: 1, tail: 40, tongue: 1 },
  hop: { ...base, bodyRot: -9, stretch: 1.06, headY: -6, fn: -42, ff: -32, bn: 40, bf: 30, earL: -26, earR: 26, tail: -24, tongue: 1 },
  sniff: { ...base, bodyRot: 7, headX: 16, headY: 32, headRot: 9, tail: -14, fn: 6, ff: 4 },
  bow: { ...base, bodyRot: 15, bodyY: 2, headX: 14, headY: 30, fn: -58, ff: -52, tail: -32, happy: 1, tongue: 1 },
  beg: { ...base, bodyRot: -36, bodyY: -6, headX: -18, headY: -18, sit: 1, fn: -70, ff: -64, tail: 30, happy: 1, tongue: 1 },
} satisfies Record<string, Pose>;

export type PoseName = keyof typeof poses;

const POSE_KEYS = Object.keys(base) as (keyof Pose)[];

/** Linear blend between two poses (t = 0 → a, t = 1 → b). */
export function mixPose(a: Pose, b: Pose, t: number): Pose {
  const out = { ...a };
  for (const k of POSE_KEYS) out[k] = a[k] + (b[k] - a[k]) * t;
  return out;
}

// ---------- motion state → transforms ----------

/** Per-frame animation inputs. All zero = a still pose. */
export type Motion = {
  /** walk cycle angle (radians) */ phase: number;
  /** 0..1 how fast he's walking */ stride: number;
  /** seconds, drives idle breathing and tail wag */ time: number;
  /** 0..1 wag intensity */ wag: number;
  /** -1..1 where the eyes look */ gazeX: number; gazeY: number;
  /** 0..1 eyelid closed amount */ blink: number;
  /** extra ear flap in degrees */ ear: number;
};

export const still: Motion = { phase: 0, stride: 0, time: 0, wag: 0, gazeX: 0, gazeY: 0, blink: 0, ear: 0 };

const r2 = (n: number) => Math.round(n * 100) / 100;
const rot = (deg: number, [x, y]: Pt) => `rotate(${r2(deg)} ${x} ${y})`;

export type Rig = ReturnType<typeof solve>;

/** Turn a pose + motion state into the SVG transforms/opacities for each body part. */
export function solve(p: Pose, m: Motion = still) {
  const swingA = Math.sin(m.phase);
  const swingB = Math.sin(m.phase + Math.PI);
  const reach = 20 + 10 * m.stride;
  const bounce = (1 - Math.cos(2 * m.phase)) / 2;
  const walking = m.stride > 0.01 ? 1 : 0;
  const breathe = Math.sin(m.time * 2.4) * (1 - walking);
  const bodyY = p.bodyY - bounce * (2.5 + 4 * m.stride) * walking + breathe * 0.6;
  const bodyRot = p.bodyRot + Math.sin(m.phase) * 1.6 * walking;
  const counter = -p.bodyRot; // front legs stay vertical when the body tilts
  const wagAmp = 5 + 17 * m.wag;
  const wagHz = 1.2 + 2.6 * m.wag;
  const tail = p.tail + Math.sin(m.time * wagHz * Math.PI * 2) * wagAmp;
  const headBob = (-(1 - Math.cos(2 * m.phase - 0.7)) / 2) * (2 + 3 * m.stride) * walking + breathe * 0.9;
  const [bx] = pivots.body;

  return {
    body: `translate(${r2(p.bodyX)} ${r2(bodyY)}) ${rot(bodyRot, pivots.body)} translate(${bx} 0) scale(${r2(p.stretch)} 1) translate(${-bx} 0)`,
    fn: `translate(${pivots.shoulderNear[0]} ${pivots.shoulderNear[1]}) rotate(${r2(p.fn + counter + swingA * reach * walking)})`,
    ff: `translate(${pivots.shoulderFar[0]} ${pivots.shoulderFar[1]}) rotate(${r2(p.ff + counter + swingB * reach * walking)})`,
    bn: `translate(${pivots.hipNear[0]} ${pivots.hipNear[1]}) rotate(${r2(p.bn + swingB * reach * walking)})`,
    bf: `translate(${pivots.hipFar[0]} ${pivots.hipFar[1]}) rotate(${r2(p.bf + swingA * reach * walking)})`,
    tail: rot(tail, pivots.tailBase),
    haunch: `translate(0 ${r2(-(p.bodyRot * 0.06))})`,
    head: `translate(${r2(p.headX)} ${r2(p.headY + headBob)}) ${rot(p.headRot + Math.sin(m.phase) * 1.4 * walking, pivots.head)}`,
    earL: rot(p.earL + m.ear + Math.sin(2 * m.phase) * 4 * walking, pivots.earL),
    earR: rot(p.earR - m.ear - Math.sin(2 * m.phase) * 4 * walking, pivots.earR),
    eyes: `translate(${r2(m.gazeX * 3.4)} ${r2(m.gazeY * 2.6)})`,
    blink: `translate(0 ${r2(EYE_Y * m.blink * 0.92)}) scale(1 ${r2(1 - 0.92 * m.blink)})`,
    openEyes: r2(Math.max(0, p.eyes - p.happy)),
    happyEyes: r2(Math.min(p.happy, p.eyes)),
    shutEyes: r2(1 - p.eyes),
    tongue: r2(p.tongue * (1 - p.mouth)),
    mouth: r2(p.mouth),
    backLegs: r2(1 - p.sit),
    haunchOpacity: r2(p.sit * (1 - p.front)),
    side: r2(1 - p.front),
    ledge: r2(p.front),
    shadow: `translate(${r2(p.bodyX * 0.6)} 0) scale(${r2(1 - 0.05 * bounce * walking)} 1)`,
    shadowOpacity: r2(0.12 * (1 - p.front)),
  };
}
