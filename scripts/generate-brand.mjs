import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { brand, brandName } from "../config/brand.ts";

const projectRoot = new URL("../", import.meta.url);
const tokens = await readFile(
  new URL("styles/tokens.css", projectRoot),
  "utf8",
);
const checkOnly = process.argv.includes("--check");

function color(name) {
  const value = tokens
    .match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1]
    ?.trim();
  if (!value) throw new Error(`Missing brand color token: ${name}`);
  return value;
}

function escapeXml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );
}

const paths = brand.mark.parts
  .map((part) => `<path d="${part.path}"/>`)
  .join("");
const svg = (body, viewBox = brand.mark.viewBox) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>\n`;
const assets = new Map();
for (const [variant, token] of [
  ["orange", "accent"],
  ["black", "ink"],
  ["white", "paper"],
]) {
  assets.set(
    `public/brand/reform-mark-${variant}.svg`,
    svg(`<g fill="${color(token)}">${paths}</g>`),
  );
}
assets.set(
  "public/reform-mark.svg",
  assets.get("public/brand/reform-mark-orange.svg"),
);
assets.set(
  "public/favicon.svg",
  svg(
    `<rect width="400" height="400" rx="55" fill="${color("ink")}"/><g transform="translate(40 25)" fill="${color("accent")}">${paths}</g>`,
    "0 0 400 400",
  ),
);
assets.set(
  "public/brand/reformers-wordmark.svg",
  svg(
    `<title>${escapeXml(brandName)}</title><g transform="translate(0 15) scale(.32)" fill="${color("accent")}">${paths}</g><text x="112" y="105" font-family="Arial,Helvetica,sans-serif" font-size="94" font-weight="700" letter-spacing="-5" fill="${color("ink")}">${escapeXml(brand.wordmark.stem)}<tspan fill="${color("accent")}">${escapeXml(brand.wordmark.punctuation)}</tspan>${escapeXml(brand.wordmark.suffix)}</text>`,
    "0 0 720 150",
  ),
);

for (const [relativePath, contents] of assets) {
  const destination = new URL(relativePath, projectRoot);
  if (checkOnly) {
    const saved = await readFile(destination, "utf8").catch(() => null);
    if (saved !== contents)
      throw new Error(`${relativePath} is stale. Run npm run brand:generate.`);
  } else {
    await mkdir(new URL(".", destination), { recursive: true });
    await writeFile(destination, contents);
  }
}
console.log(
  `${checkOnly ? "Verified" : "Generated"} ${assets.size} brand assets in ${fileURLToPath(new URL("public/", projectRoot))}`,
);
