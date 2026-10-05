import assert from "node:assert/strict";
import { test } from "node:test";
import {
  briefSchema,
  enquirySchema,
  exportBrief,
} from "../features/brief/schema.ts";
import { samples } from "../features/brief/samples.ts";
import { generateBrief } from "../features/brief/provider.ts";

test("enquiry validation rejects blank, short and oversized messages", () => {
  for (const message of [" ", "hi", "a".repeat(6001)])
    assert.equal(enquirySchema.safeParse({ message }).success, false);
  assert.equal(
    enquirySchema.parse({ message: `  ${samples[0].message}  ` }).message,
    samples[0].message,
  );
});
test("samples validate and text export includes the edited reply", () => {
  for (const sample of samples) briefSchema.parse(sample.brief);
  const text = exportBrief(samples[0].brief, "My edited reply & next steps.");
  assert.ok(text.includes("My edited reply & next steps."));
  assert.ok(text.includes("£4,000–£6,000"));
  assert.ok(!text.includes(samples[0].brief.reply));
});
test("Gemini uses the fixed lightweight model, server-side key and structured JSON", async () => {
  const fakeFetch: typeof fetch = async (url, options) => {
    assert.equal(
      url,
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    );
    assert.equal(
      new Headers(options?.headers).get("x-goog-api-key"),
      "test-only",
    );
    const body = JSON.parse(options!.body as string);
    assert.equal(body.generationConfig.responseMimeType, "application/json");
    assert.equal(
      body.generationConfig.responseJsonSchema.additionalProperties,
      false,
    );
    assert.equal(body.contents[0].parts[0].text, samples[0].message);
    return Response.json({
      candidates: [
        {
          finishReason: "STOP",
          content: { parts: [{ text: JSON.stringify(samples[0].brief) }] },
        },
      ],
    });
  };
  assert.deepEqual(
    await generateBrief(samples[0].message, { key: "test-only" }, fakeFetch),
    samples[0].brief,
  );
});
test("Gemini rejects blocked, truncated and malformed output", async () => {
  const responses = [
    new Response("Private provider details", { status: 500 }),
    Response.json({ candidates: [{ finishReason: "MAX_TOKENS" }] }),
    Response.json({ promptFeedback: { blockReason: "SAFETY" } }),
    Response.json({
      candidates: [
        {
          finishReason: "STOP",
          content: { parts: [{ text: '{"title":"incomplete"}' }] },
        },
      ],
    }),
  ];
  for (const response of responses)
    await assert.rejects(() =>
      generateBrief(
        "A test enquiry",
        { key: "test-only" },
        async () => response,
      ),
    );
});
test("free quota exhaustion makes one request and never falls back to a paid provider", async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      generateBrief("A test enquiry", { key: "test-only" }, async () => {
        calls++;
        return new Response("private quota details", { status: 429 });
      }),
    /free AI quota/,
  );
  assert.equal(calls, 1);
});
