import assert from "node:assert/strict";
import { test } from "node:test";
import { createMailto } from "../lib/enquiry.ts";

test("a direct enquiry uses the configured address without a query", () => {
  assert.equal(createMailto("hello@example.com"), "mailto:hello@example.com");
});

test("punctuation, Unicode and query characters remain part of the subject", () => {
  const subject = "reformer'S: AI & SaaS? What’s next #1";
  const url = new URL(createMailto("hello@example.com", subject));
  assert.equal(url.pathname, "hello@example.com");
  assert.equal(url.searchParams.get("subject"), subject);
  assert.deepEqual([...url.searchParams.keys()], ["subject"]);
  assert.equal(url.hash, "");
});
