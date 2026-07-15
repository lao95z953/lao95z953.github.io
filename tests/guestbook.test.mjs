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
  assert.doesNotMatch(html, /OWNER MODE/);
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

test("guestbook hides owner controls until authentication exists", async () => {
  const source = await readFile(
    new URL("app/guestbook/GuestbookBoard.tsx", projectRoot),
    "utf8",
  );

  assert.doesNotMatch(source, /adminMode/);
  assert.doesNotMatch(source, /function togglePinned/);
  assert.doesNotMatch(source, /function deleteNote/);
  assert.doesNotMatch(source, /OWNER MODE/);
  assert.match(source, /公開管理功能尚未啟用/);
  assert.match(source, /PINNED/);
});
