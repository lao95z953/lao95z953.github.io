"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type NoteColor = "yellow" | "pink" | "blue" | "green";

type BoardNote = {
  id: string;
  author: string;
  message: string;
  color: NoteColor;
  x: number;
  y: number;
  rotation: number;
  date: string;
  pinned: boolean;
};

type StoredNote = Omit<BoardNote, "pinned"> & { pinned?: boolean };

type PendingNote = Pick<BoardNote, "author" | "message" | "color">;

type DragState = {
  id: string;
  pointerId: number;
  offsetX: number;
  offsetY: number;
  maxX: number;
  maxY: number;
};

const storageKey = "lao-z-3-guestbook-prototype";

const sampleNotes: BoardNote[] = [
  {
    id: "sample-welcome",
    author: "LAO_Z_3",
    message: "歡迎來到留言板。拖曳便條紙，把它貼到你喜歡的位置。",
    color: "yellow",
    x: 7,
    y: 9,
    rotation: -2,
    date: "07.14",
    pinned: true,
  },
  {
    id: "sample-writeups",
    author: "visitor_01",
    message: "期待看到更多 Web 與 AI Security 的 Writeups！",
    color: "blue",
    x: 38,
    y: 18,
    rotation: 2,
    date: "07.14",
    pinned: false,
  },
  {
    id: "sample-ctf",
    author: "CTF player",
    message: "Keep breaking. Keep learning. 競賽加油！",
    color: "pink",
    x: 68,
    y: 11,
    rotation: -1,
    date: "07.14",
    pinned: false,
  },
  {
    id: "sample-tools",
    author: "anonymous",
    message: "Tools & Labs 的概念很棒，希望之後能看到常用腳本整理。",
    color: "green",
    x: 22,
    y: 56,
    rotation: 1,
    date: "07.14",
    pinned: false,
  },
];

const placements = [
  { x: 51, y: 53, rotation: -2 },
  { x: 5, y: 61, rotation: 2 },
  { x: 73, y: 58, rotation: 1 },
  { x: 45, y: 8, rotation: -1 },
];

const colorOptions: { value: NoteColor; label: string }[] = [
  { value: "yellow", label: "黃色" },
  { value: "pink", label: "粉紅" },
  { value: "blue", label: "藍色" },
  { value: "green", label: "綠色" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isStoredNote(value: unknown): value is StoredNote {
  if (!value || typeof value !== "object") return false;
  const note = value as Partial<BoardNote>;
  return (
    typeof note.id === "string" &&
    typeof note.author === "string" &&
    typeof note.message === "string" &&
    ["yellow", "pink", "blue", "green"].includes(note.color ?? "") &&
    typeof note.x === "number" &&
    typeof note.y === "number" &&
    typeof note.rotation === "number" &&
    typeof note.date === "string" &&
    (note.pinned === undefined || typeof note.pinned === "boolean")
  );
}

export function GuestbookBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [notes, setNotes] = useState<BoardNote[]>([...sampleNotes]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<NoteColor>("yellow");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [pendingNote, setPendingNote] = useState<PendingNote | null>(null);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    let savedNotes: BoardNote[] | null = null;
    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.every(isStoredNote)) {
        savedNotes = parsed.map((note) => ({
          id: note.id,
          author: note.author,
          message: note.message,
          color: note.color,
          x: note.x,
          y: note.y,
          rotation: note.rotation,
          date: note.date,
          pinned: note.pinned ?? false,
        }));
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }

    queueMicrotask(() => {
      if (savedNotes) setNotes(savedNotes);
      setStorageReady(true);
    });
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageReady]);

  useEffect(() => {
    if (!pendingNote) return;

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setPendingNote(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [pendingNote]);

  function requestPublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setPendingNote({
      author: author.trim() || "anonymous",
      message: trimmedMessage,
      color,
    });
  }

  function confirmPublish() {
    if (!pendingNote) return;

    const placement = placements[notes.length % placements.length];
    const date = new Intl.DateTimeFormat("zh-TW", {
      month: "2-digit",
      day: "2-digit",
    })
      .format(new Date())
      .replace("/", ".");

    setNotes((current) => [
      ...current,
      {
        id: globalThis.crypto.randomUUID(),
        ...pendingNote,
        ...placement,
        date,
        pinned: false,
      },
    ]);
    setMessage("");
    setPendingNote(null);
  }

  function resetBoard() {
    setNotes([...sampleNotes]);
    setActiveNoteId(null);
  }

  function startDragging(event: PointerEvent<HTMLElement>, noteId: string) {
    const board = boardRef.current;
    if (!board) return;

    const boardRect = board.getBoundingClientRect();
    const noteRect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: noteId,
      pointerId: event.pointerId,
      offsetX: event.clientX - noteRect.left,
      offsetY: event.clientY - noteRect.top,
      maxX: Math.max(0, 100 - (noteRect.width / boardRect.width) * 100),
      maxY: Math.max(0, 100 - (noteRect.height / boardRect.height) * 100),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setActiveNoteId(noteId);
  }

  function moveDragging(event: PointerEvent<HTMLElement>) {
    const board = boardRef.current;
    const drag = dragRef.current;
    if (!board || !drag || drag.pointerId !== event.pointerId) return;

    const boardRect = board.getBoundingClientRect();
    const x = ((event.clientX - boardRect.left - drag.offsetX) / boardRect.width) * 100;
    const y = ((event.clientY - boardRect.top - drag.offsetY) / boardRect.height) * 100;

    setNotes((current) =>
      current.map((note) =>
        note.id === drag.id
          ? {
              ...note,
              x: clamp(x, 0, drag.maxX),
              y: clamp(y, 0, drag.maxY),
            }
          : note,
      ),
    );
  }

  function stopDragging(event: PointerEvent<HTMLElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  }

  function moveWithKeyboard(event: KeyboardEvent<HTMLElement>, noteId: string) {
    const directions: Record<string, { x: number; y: number }> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
    };
    const direction = directions[event.key];
    if (!direction) return;

    event.preventDefault();
    const distance = event.shiftKey ? 5 : 1;
    setActiveNoteId(noteId);
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              x: clamp(note.x + direction.x * distance, 0, 84),
              y: clamp(note.y + direction.y * distance, 0, 76),
            }
          : note,
      ),
    );
  }

  return (
    <>
      <section className="guestbook-workspace" aria-label="留言板原型">
        <aside className="guestbook-composer">
          <div className="composer-heading">
            <span>01 / WRITE</span>
            <h2>寫一張便條</h2>
            <p>留下想說的話，選一張紙，再把它貼到布告欄上。</p>
          </div>

          <form onSubmit={requestPublish}>
            <label className="guestbook-field">
              <span>署名 / NAME</span>
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                maxLength={24}
                placeholder="anonymous"
              />
            </label>

            <label className="guestbook-field">
              <span>留言 / NOTE</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={140}
                rows={5}
                placeholder="寫下最多 140 個字……"
                required
              />
              <small>{message.length} / 140</small>
            </label>

            <fieldset className="note-colors">
              <legend>便條顏色 / COLOR</legend>
              <div>
                {colorOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="note-color"
                      value={option.value}
                      checked={color === option.value}
                      onChange={() => setColor(option.value)}
                    />
                    <span
                      className={`color-swatch note-${option.value}`}
                      aria-hidden="true"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button className="pin-note-button" type="submit">
              預覽並貼上 <span aria-hidden="true">↗</span>
            </button>
            <button className="reset-board-button" type="button" onClick={resetBoard}>
              重設展示內容
            </button>
          </form>

          <p className="prototype-notice">
            LOCAL PROTOTYPE / 目前留言只儲存在這台裝置；公開管理功能尚未啟用。
          </p>
        </aside>

        <div className="guestbook-board-area">
          <div className="board-toolbar">
            <span>02 / PIN ANYWHERE</span>
            <div>
              <strong>{notes.length.toString().padStart(2, "0")} NOTES</strong>
            </div>
          </div>
          <div className="guestbook-board" ref={boardRef}>
            {notes.map((note) => (
              <article
                className={`board-note note-${note.color}${note.pinned ? " is-pinned" : ""}${activeNoteId === note.id ? " is-active" : ""}`}
                key={note.id}
                style={{
                  left: `${note.x}%`,
                  top: `${note.y}%`,
                  transform: `rotate(${note.rotation}deg)`,
                }}
                tabIndex={0}
                aria-label={`${note.author} 的便條：${note.message}。可拖曳或用方向鍵移動。${note.pinned ? "已置頂。" : ""}`}
                onPointerDown={(event) => startDragging(event, note.id)}
                onPointerMove={moveDragging}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onKeyDown={(event) => moveWithKeyboard(event, note.id)}
                onFocus={() => setActiveNoteId(note.id)}
              >
                <span className="note-pin" aria-hidden="true" />
                {note.pinned && <span className="pinned-note-label">PINNED</span>}
                <p>{note.message}</p>
                <footer>
                  <strong>@{note.author}</strong>
                  <time>{note.date}</time>
                </footer>
              </article>
            ))}
          </div>
          <p className="board-instructions">
            便條可以自由拖曳；置頂與刪除功能會在完成管理者驗證後再啟用。
          </p>
        </div>
      </section>

      {pendingNote && (
        <div
          className="note-confirmation-backdrop"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setPendingNote(null);
          }}
        >
          <section
            className="note-confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-confirmation-title"
          >
            <div className={`confirmation-note note-${pendingNote.color}`}>
              <span className="note-pin" aria-hidden="true" />
              <p>{pendingNote.message}</p>
              <footer>
                <strong>@{pendingNote.author}</strong>
                <time>PREVIEW</time>
              </footer>
            </div>
            <div className="confirmation-copy">
              <span>FINAL CHECK / 發布確認</span>
              <h2 id="note-confirmation-title">要把這張便條貼上去嗎？</h2>
              <p>確認後，便條就會出現在留言板上。你仍然可以在發布前返回修改。</p>
              <div>
                <button type="button" onClick={() => setPendingNote(null)}>
                  返回修改
                </button>
                <button type="button" onClick={confirmPublish} autoFocus>
                  確認貼上
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
