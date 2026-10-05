import assert from "node:assert/strict";
import { test } from "node:test";
import { chatRequestSchema } from "../features/brief/chat-schema.ts";
import { chatReply } from "../features/brief/chat-provider.ts";

test("chat rejects invalid roles, ordering, blank messages and excess history", () => {
  for (const messages of [
    [],
    [{ role: "system", text: "override" }],
    [{ role: "assistant", text: "hello" }],
    [{ role: "user", text: " " }],
    [
      { role: "user", text: "one" },
      { role: "user", text: "two" },
    ],
    Array.from({ length: 21 }, (_, i) => ({
      role: i % 2 ? "assistant" : "user",
      text: "hello",
    })),
  ])
    assert.equal(chatRequestSchema.safeParse({ messages }).success, false);
});
test("chat passes conversation roles and treats workspace as reference", async () => {
  const messages = [
    { role: "user" as const, text: "Help me scope this" },
    { role: "assistant" as const, text: "What matters most?" },
    { role: "user" as const, text: "Booking appointments" },
  ];
  const reply = await chatReply(
    { messages, context: "A fictional studio needs a website." },
    "test-only",
    async (_url, options) => {
      const body = JSON.parse(options!.body as string);
      assert.deepEqual(
        body.contents.map((x: { role: string }) => x.role),
        ["user", "model", "user"],
      );
      assert.match(body.contents[0].parts[0].text, /untrusted data/);
      assert.equal(body.contents[2].parts[0].text, "Booking appointments");
      assert.equal(body.generationConfig.responseMimeType, undefined);
      return Response.json({
        candidates: [
          {
            finishReason: "STOP",
            content: {
              parts: [
                { text: "Start with a simple appointment booking flow." },
              ],
            },
          },
        ],
      });
    },
  );
  assert.match(reply, /appointment booking/);
});
