import { describe, expect, it } from "vitest";
import {
  availablePuppies,
  filterOptions,
  filterPuppies,
  getPuppy,
  goneHomePuppies,
  hasActiveFilters,
  neighbours,
  puppyMeta,
  readFilters,
} from "@/content/puppies";
import fs from "node:fs";
import path from "node:path";

const none = readFilters({});

describe("content", () => {
  it("has the same puppies as the reference", () => {
    expect(availablePuppies).toHaveLength(15);
    expect(goneHomePuppies).toHaveLength(27);
    expect(availablePuppies[0].slug).toBe("maltipoo-max-male");
    expect(goneHomePuppies[0].slug).toBe("pomeranian-ace-boy");
  });

  it("has a local file for every referenced image and video", () => {
    const missing = [...availablePuppies, ...goneHomePuppies]
      .flatMap((p) => p.media.flatMap((m) => [m, m.poster]))
      .filter((m) => m && !fs.existsSync(path.join("public", m.url)));
    expect(missing).toEqual([]);
  });
});

describe("filters", () => {
  it("returns everything with no filters", () => {
    expect(hasActiveFilters(none)).toBe(false);
    expect(filterPuppies(availablePuppies, none)).toHaveLength(15);
  });

  it("matches any of a puppy's breeds", () => {
    const cavapoo = filterPuppies(availablePuppies, { ...none, breed: "cavapoo" }).map((p) => p.slug);
    expect(cavapoo).toEqual(["maltipoo-cavapoo-male", "copper-male"]);
  });

  it("counts a boy-and-girl litter as both boys and girls", () => {
    const boys = filterPuppies(availablePuppies, { ...none, gender: "male" }).map((p) => p.slug);
    const girls = filterPuppies(availablePuppies, { ...none, gender: "female" }).map((p) => p.slug);
    expect(boys).toContain("toy-poodle-male-female");
    expect(girls).toContain("toy-poodle-male-female");
  });

  it("filters by collection and origin", () => {
    expect(filterPuppies(availablePuppies, { ...none, collection: "korean-teacup" })).toHaveLength(5);
    expect(filterPuppies(availablePuppies, { ...none, origin: "imported" })).toHaveLength(15);
    expect(filterPuppies(availablePuppies, { ...none, origin: "local" })).toHaveLength(0);
  });

  it("combines filters with AND", () => {
    const r = filterPuppies(availablePuppies, { ...none, breed: "poodle", gender: "female" });
    expect(r.map((p) => p.slug)).toEqual(["korean-teacup-poodle-female", "toy-poodle-male-female"]);
  });

  it("reads filters from URLSearchParams and page searchParams", () => {
    expect(readFilters(new URLSearchParams("breed=poodle&gender=male")).breed).toBe("poodle");
    expect(readFilters({ breed: ["poodle", "x"] }).breed).toBe("poodle");
  });

  it("only offers chips that can match something (like the reference)", () => {
    const o = filterOptions(availablePuppies);
    expect(o.breeds.map((b) => b.name)).toEqual(["Maltipoo", "Pomeranian", "Poodle", "Cavapoo", "Shih Tzu"]);
    expect(o.hasKoreanTeacup).toBe(true);
    expect(o.hasLocal).toBe(false);
  });
});

describe("navigation and labels", () => {
  it("wraps previous/next within the same list", () => {
    const max = neighbours("maltipoo-max-male")!;
    expect(max.prev.slug).toBe("korean-teacup-pomeranian-male");
    expect(max.next.slug).toBe("korean-teacup-maltipoo-female");
    const ace = neighbours("pomeranian-ace-boy")!;
    expect(ace.prev.displayName).toBe("Poodle");
    expect(ace.next.displayName).toBe("Leo");
  });

  it("builds the card meta line like the reference", () => {
    expect(puppyMeta(getPuppy("maltipoo-max-male")!)).toBe("Maltipoo · boy · 3 months");
    expect(puppyMeta(getPuppy("korean-teacup-maltipoo-female")!)).toBe("girl · 2 months");
  });
});
