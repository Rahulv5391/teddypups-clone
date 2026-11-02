import type { CSSProperties } from "react";
import type { Media } from "@/content/types";
import { MediaImage } from "./MediaImage";

// Same repeating patterns as the reference, so the wall looks hand-pinned but consistent.
const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPE_SPOTS = ["center", "left", "right", "corners", "center", "right", "left", "center"] as const;
const TAPE_COLORS = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4"];

type Props = { media: Media; order: number; sizes: string; caption?: string; preload?: boolean };

/** A taped-up instant photo. Tilt and tape vary by position in the list. */
export function Polaroid({ media, order, sizes, caption, preload = false }: Props) {
  const spot = TAPE_SPOTS[order % TAPE_SPOTS.length];
  const style = { "--tilt": `${TILTS[order % TILTS.length]}deg`, "--tape": TAPE_COLORS[order % TAPE_COLORS.length], "--i": order } as CSSProperties;
  return (
    <span className="tp-polaroid" style={style}>
      {spot === "corners" ? (
        <>
          <span aria-hidden="true" className="tp-tape tp-tape--tl" />
          <span aria-hidden="true" className="tp-tape tp-tape--tr" />
        </>
      ) : (
        <span aria-hidden="true" className={`tp-tape tp-tape--${spot}`} />
      )}
      <span className="tp-polaroid__photo">
        <MediaImage media={media} layout="natural" sizes={sizes} preload={preload} />
      </span>
      <span className="tp-polaroid__caption font-scrawl">{caption ?? media.caption}</span>
    </span>
  );
}
