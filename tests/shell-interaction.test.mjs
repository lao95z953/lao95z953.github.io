import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const shellSource = new URL(
  "../app/_components/ShellHeader.tsx",
  import.meta.url,
);

test("header contains no interactive Web Shell code", async () => {
  const source = await readFile(shellSource, "utf8");

  assert.doesNotMatch(source, /"use client"|useState|useRouter|<form|<input|<output/);
  assert.doesNotMatch(source, /visitor@lao_z_3|case "help"|publishedWriteups/);
});

test("header keeps the home link and public status", async () => {
  const source = await readFile(shellSource, "utf8");

  assert.match(source, /className="shell-brand" href="\/"/);
  assert.match(source, /PUBLIC \/ READ-ONLY/);
});
