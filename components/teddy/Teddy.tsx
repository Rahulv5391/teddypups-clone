import type { PoseName } from "@/lib/teddy/geometry";
import { TeddySvg } from "./TeddySvg";

export type TeddyProps = {
  pose?: PoseName;
  facing?: "left" | "right";
  /** Idle animation hook used by CSS (e.g. "basket", "tilt", "peekaboo"). */
  act?: string;
  label?: string;
  className?: string;
};

/**
 * A resting spot for Teddy. On its own it renders a static Teddy in the given pose.
 * The `pup-stop` data attributes let the scroll mascot (added later) find and take over these spots.
 */
export function Teddy({ pose = "sit", facing = "right", act, label, className = "" }: TeddyProps) {
  return (
    <div data-pup-stop="true" data-pose={pose} data-facing={facing} data-act={act} className={`pup-stop ${className}`}>
      <div className="pup-buddy" data-facing={facing}>
        <TeddySvg pose={pose} facing={facing} label={label} />
        <span aria-hidden="true" className="pup-bubble" data-show="false" />
      </div>
    </div>
  );
}
