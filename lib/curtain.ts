/**
 * Helpers shared with the route curtain (the page-transition blanket).
 * Safe to call when no curtain is mounted: they report "not covering".
 */

const reduceQuery = "(prefers-reduced-motion: reduce)";
export const prefersReducedMotion = () => typeof window !== "undefined" && matchMedia(reduceQuery).matches;

/** How far into its intro "rest" animation the curtain is (ms), or Infinity if not playing. */
export function curtainRestTime(): number {
  const anim = document
    .querySelector(".tp-curtain")
    ?.getAnimations()
    .find((a) => (a as CSSAnimation).animationName === "tp-curtain-rest");
  return anim && anim.playState !== "finished" && typeof anim.currentTime === "number" ? anim.currentTime : Infinity;
}

/** True while the curtain hides the page (so reveal animations should wait until it lifts). */
export function curtainDown(): boolean {
  const state = (document.querySelector(".tp-curtain") as HTMLElement | null)?.dataset.state;
  return (state === "intro" && curtainRestTime() < 560) || state === "covering" || state === "covered" || state === "snap";
}
