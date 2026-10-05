import { brandName } from "../config/brand.ts";

export function createProjectBrief(
  serviceNames: readonly string[],
  idea: string,
): string {
  return [
    `Hello ${brandName},`,
    "",
    `I’m interested in: ${serviceNames.length ? serviceNames.join(", ") : "Exploring an idea together"}.`,
    "",
    "What I have in mind:",
    idea.trim() || "I’d like to discuss a new project.",
  ].join("\n");
}
