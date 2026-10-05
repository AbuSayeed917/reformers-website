import { z } from "zod";

export const MAX_ENQUIRY_LENGTH = 6000;
export const enquirySchema = z.object({
  message: z
    .string()
    .trim()
    .min(30, "Add at least 30 characters so there is enough context.")
    .max(MAX_ENQUIRY_LENGTH),
});
export const briefSchema = z.object({
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(1500),
  services: z.array(z.string().max(120)).max(8),
  budget: z.string().max(160),
  timeline: z.string().max(160),
  deliverables: z.array(z.string().max(400)).max(10),
  questions: z.array(z.string().max(400)).min(1).max(6),
  reply: z.string().min(1).max(4000),
});
export type Brief = z.infer<typeof briefSchema>;
export type BriefResult = { brief: Brief; source: "sample" | "ai" };

export function exportBrief(brief: Brief, reply: string): string {
  return [
    brief.title,
    "",
    brief.summary,
    "",
    `Services: ${brief.services.join(", ") || "To clarify"}`,
    `Budget: ${brief.budget}`,
    `Timeline: ${brief.timeline}`,
    "",
    "DELIVERABLES",
    ...brief.deliverables.map((x) => `• ${x}`),
    "",
    "FOLLOW-UP QUESTIONS",
    ...brief.questions.map((x, i) => `${i + 1}. ${x}`),
    "",
    "REPLY DRAFT",
    reply,
  ].join("\n");
}
