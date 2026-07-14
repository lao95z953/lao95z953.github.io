import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../out/", import.meta.url);
const expectedRoutes = ["archive", "writeups", "labs", "reflections", "guestbook"];

test("homepage links to every primary content route", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  for (const route of expectedRoutes) {
    assert.match(html, new RegExp(`href=["']/${route}/?["']`));
  }
});

test("homepage uses the static site header without shell controls", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /@lao95z953/);
  assert.match(html, /PUBLIC \/ READ-ONLY/);
  assert.match(html, /mailto:lao95z953@gmail\.com/);
  assert.doesNotMatch(html, /visitor@lao_z_3|id="web-shell-input"/);
  assert.doesNotMatch(html, /href=["']#contact["']/);
});

test("static export contains every primary content route", async () => {
  await Promise.all(
    expectedRoutes.map((route) =>
      access(new URL(`${route}/index.html`, outputRoot)),
    ),
  );
});
