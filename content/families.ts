import data from "./data/families.json";
import type { Media, Testimonial } from "./types";

export const testimonial = data.testimonial as Testimonial;

/** All 64 photos shared by families, in the reference's order. */
export const familyPhotos = data.photos as Media[];

/** The captioned photos shown in the home page's "Happy families" section. */
export const featuredFamilyPhotos = familyPhotos.filter((p) => p.caption).slice(0, 8);
