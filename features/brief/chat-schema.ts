import { z } from "zod";
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string().trim().min(1).max(6000),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export const chatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(20),
    context: z.string().max(16000).default(""),
  })
  .refine(
    ({ messages }) =>
      messages.every(
        (message, index) =>
          message.role === (index % 2 === 0 ? "user" : "assistant"),
      ) && messages.at(-1)?.role === "user",
    "Conversation must alternate and end with a user message.",
  );
export type ChatRequest = z.infer<typeof chatRequestSchema>;
