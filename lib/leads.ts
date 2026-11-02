import "server-only";
import type { Enquiry } from "./enquiry";

export type Lead = Enquiry & { source: string; puppyLabel?: string; receivedAt: string };

/**
 * Deliver a validated enquiry to the team.
 *
 * TODO(block 4): connect the real destination (email/storage provider chosen via the Vercel
 * Marketplace). Until then leads are written to the server log (visible in Vercel runtime logs),
 * so nothing is lost but nothing reaches an inbox either.
 */
export async function deliverLead(lead: Lead): Promise<void> {
  console.info("[enquiry]", JSON.stringify(lead));
}
