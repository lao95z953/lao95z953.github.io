CREATE TABLE IF NOT EXISTS guestbook_notes (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL CHECK (length(author) BETWEEN 1 AND 24),
  message TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 140),
  color TEXT NOT NULL CHECK (color IN ('yellow', 'pink', 'blue', 'green')),
  x REAL NOT NULL CHECK (x BETWEEN 0 AND 100),
  y REAL NOT NULL CHECK (y BETWEEN 0 AND 100),
  rotation REAL NOT NULL CHECK (rotation BETWEEN -3 AND 3),
  pinned INTEGER NOT NULL DEFAULT 0 CHECK (pinned IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS guestbook_notes_order_idx
  ON guestbook_notes (pinned DESC, created_at ASC);

INSERT OR IGNORE INTO guestbook_notes
  (id, author, message, color, x, y, rotation, pinned, created_at, updated_at)
VALUES
  ('sample-welcome', 'LAO_Z_3', '歡迎來到留言板。拖曳便條紙，把它貼到你喜歡的位置。', 'yellow', 7, 9, -2, 1, '2026-07-14T00:00:00.000Z', '2026-07-14T00:00:00.000Z'),
  ('sample-writeups', 'visitor_01', '期待看到更多 Web 與 AI Security 的 Writeups！', 'blue', 38, 18, 2, 0, '2026-07-14T00:01:00.000Z', '2026-07-14T00:01:00.000Z'),
  ('sample-ctf', 'CTF player', 'Keep breaking. Keep learning. 競賽加油！', 'pink', 68, 11, -1, 0, '2026-07-14T00:02:00.000Z', '2026-07-14T00:02:00.000Z'),
  ('sample-tools', 'anonymous', 'Tools & Labs 的概念很棒，希望之後能看到常用腳本整理。', 'green', 22, 56, 1, 0, '2026-07-14T00:03:00.000Z', '2026-07-14T00:03:00.000Z');
