import { flowRequestSchema } from "@/features/flow/model";
import { executeFlowStep } from "@/features/flow/provider";
import { BriefProviderError } from "@/features/brief/provider";
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const fail = (error: string, status: number) =>
    Response.json({ error }, { status, headers });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return fail("Use this workflow from its website.", 403);
  const key = process.env.GEMINI_API_KEY;
  if (!key)
    return fail(
      "Live AI is not connected. You can still run the sample workflow.",
      503,
    );
  try {
    const raw = await request.text();
    if (raw.length > 40000) return fail("This enquiry is too long.", 413);
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      return fail("Invalid workflow request.", 400);
    }
    const parsed = flowRequestSchema.safeParse(data);
    if (!parsed.success)
      return fail(
        "Provide a valid enquiry between 30 and 6,000 characters.",
        400,
      );
    return Response.json(await executeFlowStep(parsed.data, key), { headers });
  } catch (error) {
    return fail(
      error instanceof BriefProviderError
        ? error.message
        : "This step failed. Try running the workflow again.",
      error instanceof BriefProviderError ? error.status : 502,
    );
  }
}
