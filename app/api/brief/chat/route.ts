import { chatRequestSchema } from "@/features/brief/chat-schema";
import { chatReply } from "@/features/brief/chat-provider";
import { BriefProviderError } from "@/features/brief/provider";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const fail = (error: string, status: number) =>
    Response.json({ error }, { status, headers });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return fail("This request must come from this website.", 403);
  const key = process.env.GEMINI_API_KEY;
  if (!key)
    return fail(
      "The chatbot is not connected yet. Please try again later.",
      503,
    );
  try {
    const raw = await request.text();
    if (raw.length > 150000)
      return fail("This conversation is too long. Start a new chat.", 413);
    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch {
      return fail("Send a valid chat message.", 400);
    }
    const parsed = chatRequestSchema.safeParse(value);
    if (!parsed.success)
      return fail(
        "Keep messages under 6,000 characters and start a new chat after 10 replies.",
        400,
      );
    const text = await chatReply(parsed.data, key);
    return Response.json({ text }, { headers });
  } catch (error) {
    return fail(
      error instanceof BriefProviderError
        ? error.message
        : "Could not reply right now. Your message is still here; try again.",
      error instanceof BriefProviderError ? error.status : 502,
    );
  }
}
