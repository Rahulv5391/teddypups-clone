"use server";

import { headers } from "next/headers";
import { getPuppyById } from "@/content/puppies";
import { enquirySchema, fieldErrors, formToObject, type EnquiryState } from "@/lib/enquiry";
import { deliverLead } from "@/lib/leads";

// Simple per-instance rate limit: 5 enquiries per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function sendEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const raw = formToObject(formData);

  // Honeypot filled in: pretend it worked so bots don't learn anything.
  if (raw.website) return { ok: true };

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { ok: false, message: "You've sent a few enquiries already — please message us on WhatsApp for a quick reply." };
  }

  const data = parsed.data;
  const pup = data.puppyId ? getPuppyById(data.puppyId) : undefined;

  try {
    await deliverLead({
      ...data,
      source: h.get("referer") ?? "",
      puppyLabel: pup ? `${pup.displayName} (${pup.breed})` : undefined,
      receivedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[enquiry] delivery failed", err);
    return { ok: false, message: "Sorry, we couldn't send that just now. Please try again or message us on WhatsApp." };
  }
  return { ok: true };
}
