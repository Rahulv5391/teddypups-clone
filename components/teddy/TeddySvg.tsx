import type { CSSProperties } from "react";
import { colors, legs, paths, poses, shadow, solve, toes, GROUND_Y, EYE_Y, VIEW_H, VIEW_W, type PoseName, type Rig } from "@/lib/teddy/geometry";

const stroke = { stroke: colors.ink, strokeWidth: 3.4, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const line = { ...stroke, fill: "none" } as const;

function Leg({ part, d, len, fill, transform, opacity }: { part: string; d: string; len: number; fill: string; transform: string; opacity?: number }) {
  return (
    <g data-p={part} transform={transform} opacity={opacity}>
      <path d={`${d}Z`} fill={fill} />
      <path d={d} {...line} />
      <path d={toes(len)} {...line} strokeWidth={2.4} />
    </g>
  );
}

function OpenEyes() {
  return (
    <>
      <ellipse cx={194} cy={EYE_Y} rx={7.4} ry={8.6} fill={colors.ink} />
      <ellipse cx={230} cy={EYE_Y} rx={7.4} ry={8.6} fill={colors.ink} />
      <circle cx={196.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
      <circle cx={232.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
      <circle cx={192} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
      <circle cx={228} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
    </>
  );
}

export type TeddySvgProps = {
  pose?: PoseName;
  /** Precomputed transforms (for animated Teddy); overrides `pose`. */
  rig?: Rig;
  facing?: "left" | "right";
  /** Accessible description; omit to hide from assistive tech. */
  label?: string;
  className?: string;
  style?: CSSProperties;
};

/** Teddy the mascot as a single SVG. Pure and server-renderable. */
export function TeddySvg({ pose = "sit", rig, facing = "right", label, className, style }: TeddySvgProps) {
  const r = rig ?? solve(poses[pose]);
  const flip = facing === "left" ? `translate(${VIEW_W} 0) scale(-1 1)` : undefined;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      style={{ overflow: "visible", ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <g data-p="root" transform={flip}>
        <ellipse data-p="shadow" {...shadow} fill={colors.ink} opacity={r.shadowOpacity} transform={r.shadow} style={{ transformBox: "fill-box", transformOrigin: "center" }} />

        {/* side view body */}
        <g data-p="body" transform={r.body} opacity={r.side}>
          <Leg part="bf" d={legs.backFar} len={GROUND_Y - 192} fill={colors.furShade} transform={r.bf} opacity={r.backLegs} />
          <Leg part="ff" d={legs.frontFar} len={GROUND_Y - 192} fill={colors.furShade} transform={r.ff} />
          <g data-p="tail" transform={r.tail}>
            <path d={paths.tailStem} {...line} strokeWidth={9} />
            <path d={paths.tailStem} stroke={colors.fur} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={paths.tail} fill={colors.fur} {...stroke} />
          </g>
          <Leg part="bn" d={legs.back} len={GROUND_Y - 194} fill={colors.fur} transform={r.bn} opacity={r.backLegs} />
          <path d={paths.body} fill={colors.fur} {...stroke} />
          <path d={paths.chest} fill={colors.fur} {...stroke} />
          <Leg part="fn" d={legs.front} len={GROUND_Y - 194} fill={colors.fur} transform={r.fn} />
        </g>

        {/* sitting haunch */}
        <g data-p="haunch" opacity={r.haunchOpacity} transform={r.haunch}>
          <path d={paths.haunch} fill={colors.fur} {...stroke} />
          <path d={paths.haunchPaw} fill={colors.fur} {...stroke} />
          <path d={paths.haunchToes} {...line} strokeWidth={2.4} />
        </g>

        {/* head */}
        <g data-p="head" transform={r.head}>
          <path d={paths.collar} fill={colors.collar} {...stroke} strokeWidth={3} />
          <path d={paths.tag} fill={colors.cream} {...stroke} strokeWidth={2.4} />
          <path data-p="earL" d={paths.earL} fill={colors.furShade} {...stroke} transform={r.earL} />
          <path data-p="earR" d={paths.earR} fill={colors.furShade} {...stroke} transform={r.earR} />
          <path d={paths.head} fill={colors.fur} {...stroke} />
          <path d={paths.topknot} fill={colors.fur} {...stroke} strokeWidth={3} />
          <path d={paths.muzzle} fill={colors.cream} />
          <circle cx={181} cy={116} r={7} fill={colors.blush} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={colors.blush} opacity={0.85} />
          <g data-p="eyes" transform={r.eyes}>
            <g data-p="open" opacity={r.openEyes}>
              <g data-p="blink" transform={r.blink}>
                <OpenEyes />
              </g>
            </g>
          </g>
          <path data-p="happy" d={paths.happyEyes} {...line} opacity={r.happyEyes} />
          <path data-p="shut" d={paths.shutEyes} {...line} opacity={r.shutEyes} />
          <path d={paths.nose} fill={colors.ink} />
          <path d={paths.mouth} {...line} strokeWidth={3} />
          <path data-p="tongue" d={paths.tongue} fill="#e98c8c" stroke={colors.ink} strokeWidth={2.2} strokeLinejoin="round" opacity={r.tongue} />
          <g data-p="mouth" opacity={r.mouth}>
            <path d={paths.mouthOpen} fill="#6b2a1c" {...stroke} strokeWidth={2.6} />
            <path d={paths.mouthOpenTongue} fill="#e98c8c" />
          </g>
        </g>

        {/* paws resting on a ledge (front view) */}
        <g data-p="ledge" opacity={r.ledge}>
          <path d={paths.ledgePaws} fill={colors.fur} {...stroke} />
          <path d={paths.ledgeToes} {...line} strokeWidth={2.4} />
        </g>
      </g>
    </svg>
  );
}
