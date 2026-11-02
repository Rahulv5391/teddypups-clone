import { z } from "zod";

/** Shared by the enquiry form (client) and the sendEnquiry server action. */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80, "That name is a little long."),
  phone: z
    .string()
    .trim()
    .min(1, "We need a number to reach you on.")
    .regex(/^\+?[0-9][0-9\s\-()]{6,18}$/, "Please include your country code, e.g. +971 50 123 4567."),
  email: z.union([z.literal(""), z.email("That email doesn't look right.")]).default(""),
  area: z.string().trim().max(80, "Please keep this short.").default(""),
  message: z.string().trim().max(2000, "Please keep your message under 2000 characters.").default(""),
  puppyId: z.string().trim().max(64).default(""),
  /** Honeypot: hidden from people, bots fill it in. */
  website: z.string().max(0).optional().default(""),
});

export type Enquiry = z.infer<typeof enquirySchema>;
export type EnquiryField = Exclude<keyof Enquiry, "website">;

export type EnquiryState = {
  ok: boolean;
  /** Form-level error (e.g. rate limited, delivery failed). */
  message?: string;
  errors?: Partial<Record<EnquiryField, string>>;
};

/** Turn FormData into a plain object the schema can parse. */
export function formToObject(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") out[k] = v;
  return out;
}

export function fieldErrors(error: z.ZodError): EnquiryState["errors"] {
  const errors: EnquiryState["errors"] = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as EnquiryField;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
