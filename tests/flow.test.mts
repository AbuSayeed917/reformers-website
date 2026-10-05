import assert from "node:assert/strict";
import { test } from "node:test";
import {
  flowRequestSchema,
  nodeStatus,
  steps,
} from "../features/flow/model.ts";
import { executeFlowStep } from "../features/flow/provider.ts";
import {
  sampleMessage,
  sampleClassification,
  sampleReply,
} from "../features/flow/sample.ts";

test("flow only accepts supported steps with their required context", () => {
  for (const value of [
    { step: "send", message: sampleMessage },
    { step: "classify", message: "hi" },
    { step: "draft", message: sampleMessage },
  ])
    assert.equal(flowRequestSchema.safeParse(value).success, false);
  assert.equal(
    flowRequestSchema.safeParse({
      step: "draft",
      message: sampleMessage,
      classification: sampleClassification,
    }).success,
    true,
  );
});
test("flow pauses at approval and preserves prior successful steps on failure", () => {
  assert.deepEqual(
    steps.map(({ id }) => nodeStatus(id, "review")),
    ["done", "done", "done", "review"],
  );
  assert.deepEqual(
    steps.map(({ id }) => nodeStatus(id, "error", "draft")),
    ["done", "done", "error", "waiting"],
  );
  assert.equal(nodeStatus("approve", "rejected"), "rejected");
  assert.equal(nodeStatus("approve", "drafting"), "waiting");
  assert.equal(nodeStatus("approve", "approved"), "done");
});
test("flow draft receives classification and validates provider output", async () => {
  const input = {
    step: "draft" as const,
    message: sampleMessage,
    classification: sampleClassification,
  };
  const fakeFetch: typeof fetch = async (_url, options) => {
    const payload = JSON.parse(options!.body as string);
    assert.deepEqual(JSON.parse(payload.contents[0].parts[0].text), input);
    return Response.json({
      candidates: [
        {
          finishReason: "STOP",
          content: {
            parts: [{ text: JSON.stringify({ reply: sampleReply }) }],
          },
        },
      ],
    });
  };
  assert.deepEqual(await executeFlowStep(input, "test-only", fakeFetch), {
    reply: sampleReply,
  });
  await assert.rejects(() =>
    executeFlowStep(
      { step: "classify", message: sampleMessage },
      "test-only",
      async () =>
        Response.json({
          candidates: [
            {
              finishReason: "STOP",
              content: { parts: [{ text: '{"category":"invented"}' }] },
            },
          ],
        }),
    ),
  );
});
