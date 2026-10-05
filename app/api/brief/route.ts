import { enquirySchema } from "@/features/brief/schema";
import { generateBrief, BriefProviderError } from "@/features/brief/provider";

function configuration() {
  return {
    key: process.env.GEMINI_API_KEY ?? "",
  };
}
export async function GET() {
  const { key } = configuration();
  return Response.json(
    { available: Boolean(key) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { error: "This request must come from this website." },
      { status: 403, headers },
    );
  const { key } = configuration();
  if (!key)
    return Response.json(
      {
        error:
          "Live AI is not connected yet. You can explore the sample enquiries.",
      },
      { status: 503, headers },
    );
  try {
    const body = await request.text();
    if (body.length > 30000)
      return Response.json(
        { error: "This enquiry is too long." },
        { status: 413, headers },
      );
    let value: unknown;
    try {
      value = JSON.parse(body);
    } catch {
      return Response.json(
        { error: "Send a valid enquiry." },
        { status: 400, headers },
      );
    }
    const parsed = enquirySchema.safeParse(value);
    if (!parsed.success)
      return Response.json(
        { error: "Enter an enquiry between 30 and 6,000 characters." },
        { status: 400, headers },
      );
    const brief = await generateBrief(parsed.data.message, { key });
    return Response.json({ brief, source: "ai" }, { headers });
  } catch (error) {
    if (error instanceof BriefProviderError)
      return Response.json(
        { error: error.message },
        { status: error.status, headers },
      );
    return Response.json(
      {
        error:
          "We couldn't create a brief just now. Your enquiry is still here; please try again.",
      },
      { status: 502, headers },
    );
  }
}
