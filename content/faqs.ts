import data from "./data/faqs.json";
import type { Faq } from "./types";

export const faqs = data as Faq[];

/** The first three questions shown on the home page. */
export const homeFaqs = faqs.slice(0, 3);
