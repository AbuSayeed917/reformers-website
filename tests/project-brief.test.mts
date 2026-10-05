import assert from "node:assert/strict";
import { test } from "node:test";
import { createProjectBrief } from "../lib/project-brief.ts";
import { createMailto } from "../lib/enquiry.ts";
import { brandName } from "../config/brand.ts";
import { services } from "../content/services.ts";
import { processSteps } from "../content/process.ts";
import { serviceFlows, processArtifacts } from "../content/transformations.ts";

test("an enquiry draft preserves chosen services, Unicode, newlines and query delimiters", () => {
  const idea = "Build an app & automate invoices?\nA “better” workflow #1";
  const body = createProjectBrief(["APPS", "AI AUTOMATION"], idea);
  const url = new URL(createMailto("hello@example.com", "A new project", body));
  assert.equal(url.searchParams.get("body"), body);
  assert.ok(body.startsWith(`Hello ${brandName},`));
  assert.ok(body.includes("APPS, AI AUTOMATION"));
  assert.ok(body.endsWith(idea));
  assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
  assert.equal(url.hash, "");
});

test("an empty brief still opens a useful conversation", () => {
  const body = createProjectBrief([], "  ");
  assert.ok(body.includes("Exploring an idea together"));
  assert.ok(body.includes("I’d like to discuss a new project."));
});

test("each selectable service and process chapter has supporting content", () => {
  assert.deepEqual(
    Object.keys(serviceFlows).sort(),
    services.map((service) => service.id).sort(),
  );
  assert.deepEqual(
    processArtifacts.map((item) => item.id),
    processSteps.map((step) => step.id),
  );
});
