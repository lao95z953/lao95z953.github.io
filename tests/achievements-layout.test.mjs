import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("achievement update date uses a stacked header in the narrow sidebar", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
  ]);

  assert.match(page, /className="section-head achievement-head"/);
  assert.match(page, /className="achievement-list"/);
  assert.match(page, /achievements\.slice\(\)\.reverse\(\)\.map/);
  assert.match(
    css,
    /\.achievement-head\s*\{[^}]*flex-direction:\s*column;/s,
  );
  assert.match(
    css,
    /\.achievement-list\s*\{[^}]*max-height:\s*330px;[^}]*overflow-y:\s*auto;/s,
  );
});
