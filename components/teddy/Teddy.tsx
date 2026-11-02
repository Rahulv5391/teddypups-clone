import type { PoseName } from "@/lib/teddy/geometry";
import { TeddySvg } from "./TeddySvg";

export type TeddyProps = {
  pose?: PoseName;
  facing?: "left" | "right";
  /** Idle animation hook used by CSS (e.g. "basket", "tilt", "peekaboo"). */
  act?: string;
  label?: string;
  className?: string;
  /**
   * A "stop" is a resting spot the scroll mascot can walk to and take over (default).
   * Set false for purely decorative Teddys (e.g. the sketchbook self-portrait).
   */
  stop?: boolean;
};

export function Teddy({ pose = "sit", facing = "right", act, label, className = "", stop = true }: TeddyProps) {
  const buddy = (
    <div className={`pup-buddy ${stop ? "" : className}`.trim()} data-facing={facing}>
      <TeddySvg pose={pose} facing={facing} label={label} />
      <span aria-hidden="true" className="pup-bubble" data-show="false" />
    </div>
  );
  if (!stop) return buddy;
  return (
    <div data-pup-stop="true" data-pose={pose} data-facing={facing} data-act={act} className={`pup-stop ${className}`}>
      {buddy}
    </div>
  );
}
