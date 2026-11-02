import { describe, expect, it } from "vitest";
import { mixPose, paths, poses, solve } from "@/lib/teddy/geometry";

// Expected values copied from the reference site's rendered footer SVG ("Teddy, sitting snug in his basket").
describe("Teddy geometry matches the reference", () => {
  it("generates identical fluffy outlines", () => {
    expect(paths.head.startsWith("M212.0 54.0Q223.4 48.2 231.5 57.5Q244.5 56.1 248.1 67.5")).toBe(true);
    expect(paths.tail).toBe(
      "M70.0 110.0Q78.1 105.0 80.9 113.7Q90.5 114.8 86.7 123.2Q93.4 129.9 84.7 134.0Q85.2 143.1 75.8 141.0Q70.0 148.3 64.2 141.0Q54.8 143.1 55.3 134.0Q46.6 129.9 53.3 123.2Q49.5 114.8 59.1 113.7Q61.9 105.0 70.0 110.0Z",
    );
    expect(paths.topknot.startsWith("M195.0 52.0Q190.7 45.8 200.0 43.5")).toBe(true);
  });

  it("solves the snug pose to the same transforms", () => {
    const r = solve(poses.snug);
    expect(r.head).toBe("translate(0 9) rotate(4 212 100)");
    expect(r.tail).toBe("rotate(-20 84 150)");
    expect(r.earL).toBe("rotate(3 174 82)");
    expect(r.earR).toBe("rotate(-3 250 82)");
    expect(r.body).toBe("translate(0 0) rotate(0 196 206) translate(196 0) scale(1 1) translate(-196 0)");
    expect([r.side, r.ledge, r.haunchOpacity, r.tongue]).toEqual([0, 1, 0, 0]);
  });

  it("blends poses linearly", () => {
    const half = mixPose(poses.stand, poses.sit, 0.5);
    expect(half.bodyRot).toBe(-12);
    expect(half.sit).toBe(0.5);
  });
});
