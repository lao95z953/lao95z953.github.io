import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("header uses a compact two-column layout", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");

  assert.match(
    css,
    /\.page-shell\s*\{[^}]*width:\s*min\(calc\(100% - 40px\), 1680px\);/s,
  );
  assert.match(
    css,
    /\.shell-header\s*\{[^}]*grid-template-columns:\s*auto 1fr;/s,
  );
  assert.match(css, /\.shell-mode\s*\{[^}]*justify-self:\s*end;/s);
  assert.match(
    css,
    /\.hero,\s*\.archive-grid\s*\{[^}]*grid-template-columns:\s*80px minmax\(0, 1fr\) 330px;/s,
  );
  assert.match(css, /\.intro\s*\{[^}]*font-size:\s*18px;/s);
});

test("Web Shell styles have been removed", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");

  assert.doesNotMatch(
    css,
    /\.web-shell|\.shell-input-row|\.shell-live-prompt|\.shell-inline-result/,
  );
});
