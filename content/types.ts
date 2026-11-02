/** A photo or video, in the same shape the reference site's CMS uses. */
export type Media = {
  id: string;
  url: string;
  kind: "image" | "video";
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** Focal point (0–1) used for object-position when cropping. */
  focalX: number;
  focalY: number;
  /** Dominant colour, used as the background while loading. */
  color: string;
  blurDataUrl?: string;
  durationS: number | null;
  poster: Media | null;
};

export type Ref = { slug: string; name: string };

export type PuppyStatus = "available" | "reserved" | "rehomed";
export type Gender = "male" | "female" | "male-female";

export type Puppy = {
  id: string;
  slug: string;
  /** Pet name, empty when the puppy has none yet (then displayName is the breed). */
  name: string;
  displayName: string;
  breed: string;
  gender: Gender;
  genderLabel: string;
  age: string;
  colour: string;
  description: string;
  seoDescription?: string;
  status: PuppyStatus;
  origin: Ref | null;
  breeds: Ref[];
  collections: Ref[];
  cover: Media | null;
  media: Media[];
  order: number;
  /** Gone-home tickets only: "TeddyPups" or "Dubai showroom". */
  ticketFrom?: string;
};

export type Faq = { id: string; question: string; answer: string };

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  location: string;
  media: Media | null;
};
