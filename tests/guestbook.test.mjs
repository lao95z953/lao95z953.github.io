import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("guestbook exports the bulletin-board prototype", async () => {
  const html = await readFile(
    new URL("out/guestbook/index.html", projectRoot),
    "utf8",
  );

  assert.match(html, /Community wall \/ 訪客留言板/);
  assert.match(html, /Leave a note\./);
  assert.match(html, /寫一張便條/);
  assert.match(html, /LOCAL PROTOTYPE/);
  assert.match(html, /歡迎來到留言板/);
});

test("guestbook notes can be created, stored and repositioned", async () => {
  const source = await readFile(
    new URL("app/guestbook/GuestbookBoard.tsx", projectRoot),
    "utf8",
  );

  assert.match(source, /localStorage\.setItem/);
  assert.match(source, /onPointerDown/);
  assert.match(source, /onPointerMove/);
  assert.match(source, /ArrowLeft/);
  assert.match(source, /maxLength=\{140\}/);
  assert.match(source, /setPendingNote/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /確認貼上/);
});

test("guestbook owner controls can pin and delete notes", async () => {
  const source = await readFile(
    new URL("app/guestbook/GuestbookBoard.tsx", projectRoot),
    "utf8",
  );

  assert.match(source, /aria-pressed=\{adminMode\}/);
  assert.match(source, /function togglePinned/);
  assert.match(source, /function deleteNote/);
  assert.match(source, /OWNER MODE/);
  assert.match(source, /PINNED/);
});
