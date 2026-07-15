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
  assert.match(html, /PUBLIC GUESTBOOK/);
  assert.match(html, /歡迎來到留言板/);
  assert.doesNotMatch(html, /OWNER MODE/);
});

test("guestbook notes use the public API for publishing and repositioning", async () => {
  const source = await readFile(
    new URL("app/guestbook/GuestbookBoard.tsx", projectRoot),
    "utf8",
  );

  assert.doesNotMatch(source, /localStorage/);
  assert.match(source, /fetch\("\/api\/notes"/);
  assert.match(source, /method: "POST"/);
  assert.match(source, /method: "PATCH"/);
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
  assert.match(source, /管理功能尚未公開/);
  assert.match(source, /PINNED/);
});

test("guestbook API validates writes and persists notes in D1", async () => {
  const [collectionApi, noteApi, migration, config] = await Promise.all([
    readFile(new URL("functions/api/notes/index.js", projectRoot), "utf8"),
    readFile(new URL("functions/api/notes/[id].js", projectRoot), "utf8"),
    readFile(new URL("migrations/0001_create_guestbook_notes.sql", projectRoot), "utf8"),
    readFile(new URL("wrangler.toml", projectRoot), "utf8"),
  ]);

  assert.match(collectionApi, /export async function onRequestGet/);
  assert.match(collectionApi, /export async function onRequestPost/);
  assert.match(collectionApi, /INSERT INTO guestbook_notes/);
  assert.match(collectionApi, /maximumNotes = 200/);
  assert.match(noteApi, /export async function onRequestPatch/);
  assert.match(noteApi, /UPDATE guestbook_notes/);
  assert.doesNotMatch(noteApi, /onRequestDelete/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS guestbook_notes/);
  assert.match(config, /binding = "DB"/);
});
