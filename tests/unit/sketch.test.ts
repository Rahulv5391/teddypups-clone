import { describe, expect, it } from "vitest";
import { sketchFor } from "@/lib/sketch";

const doodleTransform = (d: { x: number; y: number; rot: number; size: number }) =>
  `translate(${d.x.toFixed(1)} ${d.y.toFixed(1)}) rotate(${d.rot.toFixed(0)}) scale(${d.size.toFixed(2)})`;

// Expected values read from the reference site's rendered /puppies page.
describe("sketch frames match the reference", () => {
  it("Max", () => {
    const s = sketchFor("maltipoo-max-male");
    expect(s.tilt.toFixed(2)).toBe("0.36");
    expect(s.wash.color).toBe("#f2be6b");
    expect(`${s.wash.dx.toFixed(1)}% ${s.wash.dy.toFixed(1)}%`).toBe("-4.0% 4.9%");
    expect(s.doodles.map(doodleTransform)).toEqual([
      "translate(-7.0 64.1) rotate(-9) scale(0.85)",
      "translate(6.7 16.0) rotate(-10) scale(0.95)",
    ]);
    expect(s.doodles.map((d) => d.kind)[1]).toBe("paw");
  });

  it("Ace (gone home)", () => {
    const s = sketchFor("pomeranian-ace-boy");
    expect(s.tilt.toFixed(2)).toBe("-0.63");
    expect(s.wash.color).toBe("#f9cdbf");
    expect(s.doodles.map(doodleTransform)).toEqual([
      "translate(-8.5 46.0) rotate(21) scale(1.11)",
      "translate(100.3 75.7) rotate(15) scale(1.14)",
      "translate(7.2 14.6) rotate(-14) scale(0.91)",
    ]);
  });
});
