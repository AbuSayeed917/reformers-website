import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
async function filesWithin(directory: string): Promise<string[]> {
  const entries = await readdir(new URL(directory, root), {
    withFileTypes: true,
  });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? filesWithin(join(directory, entry.name))
        : [join(directory, entry.name)],
    ),
  );
  return files.flat();
}

test("authored styles only reference defined design tokens and contain no private palettes", async () => {
  const tokens = await readFile(new URL("styles/tokens.css", root), "utf8");
  const defined = new Set(
    [...tokens.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]),
  );
  const files = (
    await Promise.all(
      [
        "components/site",
        "components/brand",
        "features/home",
        "features/brief",
        "features/flow",
      ].map(filesWithin),
    )
  )
    .flat()
    .filter((file) => file.endsWith(".css"));
  for (const file of files) {
    const source = await readFile(new URL(file, root), "utf8");
    assert.equal(
      /#[\da-f]{3,8}\b/i.test(source),
      false,
      `${file}: add palette values to tokens.css`,
    );
    for (const [, name] of source.matchAll(/var\((--[\w-]+)/g))
      assert.ok(defined.has(name), `${file}: undefined token ${name}`);
  }
});
