import data from "./data/puppies.json";
import breedData from "./data/breeds.json";
import type { Puppy, Ref } from "./types";

const all = (data as Puppy[]).slice().sort((a, b) => a.order - b.order);

export const breeds = breedData as Ref[];

export const statusLabel: Record<Puppy["status"], string> = {
  available: "Available",
  reserved: "Reserved",
  rehomed: "Gone home",
};

/** Puppies looking for a home, in the reference's display order. */
export const availablePuppies = all.filter((p) => p.status !== "rehomed");

/** Puppies that have already gone home. */
export const goneHomePuppies = all.filter((p) => p.status === "rehomed");

export function getPuppy(slug: string): Puppy | undefined {
  return all.find((p) => p.slug === slug);
}

export function getPuppyById(id: string): Puppy | undefined {
  return all.find((p) => p.id === id);
}

export function allPuppySlugs(): string[] {
  return all.map((p) => p.slug);
}

/** Previous / next puppy within the same list (available or gone home), wrapping around. */
export function neighbours(slug: string): { prev: Puppy; next: Puppy } | null {
  const pup = getPuppy(slug);
  if (!pup) return null;
  const list = pup.status === "rehomed" ? goneHomePuppies : availablePuppies;
  const i = list.findIndex((p) => p.slug === slug);
  if (list.length < 2) return null;
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

export const hasVideo = (p: Puppy) => p.media.some((m) => m.kind === "video");

/** "Maltipoo · boy · 3 months" — the card meta line, built the same way as the reference. */
export function puppyMeta(p: Puppy): string {
  return `${p.name ? `${p.breed} · ` : ""}${p.genderLabel.toLowerCase()}${p.age ? ` · ${p.age}` : ""}`;
}

// ---------- filters (same rules as the reference PuppyBrowser) ----------

export const FILTER_KEYS = ["origin", "breed", "gender", "collection"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type Filters = Record<FilterKey, string>;

export function readFilters(params: URLSearchParams | Record<string, string | string[] | undefined>): Filters {
  const get = (k: FilterKey) => {
    const v = params instanceof URLSearchParams ? params.get(k) : params[k];
    return (Array.isArray(v) ? v[0] : v) ?? "";
  };
  return { origin: get("origin"), breed: get("breed"), gender: get("gender"), collection: get("collection") };
}

export const hasActiveFilters = (f: Filters) => FILTER_KEYS.some((k) => f[k]);

export function filterPuppies(list: Puppy[], f: Filters): Puppy[] {
  return list.filter(
    (p) =>
      (!f.origin || p.origin?.slug === f.origin) &&
      (!f.breed || p.breeds.some((b) => b.slug === f.breed)) &&
      (!f.gender || p.gender === f.gender || p.gender === "male-female") &&
      (!f.collection || p.collections.some((c) => c.slug === f.collection)),
  );
}

/** Which filter chips to show — only options that at least one puppy can match. */
export function filterOptions(list: Puppy[]) {
  return {
    breeds: breeds.filter((b) => list.some((p) => p.breeds.some((pb) => pb.slug === b.slug))),
    hasKoreanTeacup: list.some((p) => p.collections.some((c) => c.slug === "korean-teacup")),
    hasLocal: list.some((p) => p.origin?.slug === "local"),
  };
}
