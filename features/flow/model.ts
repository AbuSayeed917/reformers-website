import { z } from "zod";
export const classificationSchema = z.object({
  category: z.enum(["Website", "App", "Automation", "SaaS", "Other"]),
  summary: z.string().min(1).max(1000),
  reason: z.string().min(1).max(500),
});
export const draftSchema = z.object({ reply: z.string().min(1).max(4000) });
export const flowRequestSchema = z.discriminatedUnion("step", [
  z.object({
    step: z.literal("classify"),
    message: z.string().trim().min(30).max(6000),
  }),
  z.object({
    step: z.literal("draft"),
    message: z.string().trim().min(30).max(6000),
    classification: classificationSchema,
  }),
]);
export type Classification = z.infer<typeof classificationSchema>;
export type Phase =
  | "idle"
  | "classifying"
  | "drafting"
  | "review"
  | "approved"
  | "rejected"
  | "error";
export const steps = [
  {
    id: "trigger",
    title: "Enquiry received",
    kind: "TRIGGER",
    detail: "Capture the incoming message",
  },
  {
    id: "classify",
    title: "Understand & route",
    kind: "AI STEP",
    detail: "Find the right service category",
  },
  {
    id: "draft",
    title: "Prepare a reply",
    kind: "AI STEP",
    detail: "Write a response with context",
  },
  {
    id: "approve",
    title: "Human approval",
    kind: "CHECKPOINT",
    detail: "You decide what goes forward",
  },
] as const;
export type StepId = (typeof steps)[number]["id"];
export function nodeStatus(
  id: StepId,
  phase: Phase,
  failedStep: StepId = "classify",
) {
  if (phase === "idle") return "ready";
  const active = phase === "classifying" ? 1 : phase === "drafting" ? 2 : 3;
  const index = steps.findIndex((step) => step.id === id);
  if (phase === "error") {
    const failed = steps.findIndex((step) => step.id === failedStep);
    return index === failed ? "error" : index < failed ? "done" : "waiting";
  }
  if (phase === "approved") return "done";
  if (phase === "rejected") return id === "approve" ? "rejected" : "done";
  return index < active
    ? "done"
    : index === active
      ? phase === "review"
        ? "review"
        : "running"
      : "waiting";
}
