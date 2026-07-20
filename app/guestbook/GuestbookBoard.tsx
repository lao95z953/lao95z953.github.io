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

type PendingNote = Pick<BoardNote, "author" | "message" | "color">;

type BoardStatus = "loading" | "ready" | "error";

type DragState = {
  id: string;
  pointerId: number;
  offsetX: number;
  offsetY: number;
  maxX: number;
  maxY: number;
};

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

const colorOptions: { value: NoteColor; label: string }[] = [
  { value: "yellow", label: "黃色" },
  { value: "pink", label: "粉紅" },
  { value: "blue", label: "藍色" },
  { value: "green", label: "綠色" },
];

const TURNSTILE_SITEKEY = "0x4AAAAAAD5gpppZIdBJYLsW";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

function getTurnstile(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isBoardNote(value: unknown): value is BoardNote {
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
    typeof note.pinned === "boolean"
  );
}

function isNotesResponse(value: unknown): value is { notes: BoardNote[] } {
  if (!value || typeof value !== "object") return false;
  const response = value as { notes?: unknown };
  return Array.isArray(response.notes) && response.notes.every(isBoardNote);
}

function isNoteResponse(value: unknown): value is { note: BoardNote } {
  if (!value || typeof value !== "object") return false;
  return isBoardNote((value as { note?: unknown }).note);
}

function errorMessage(value: unknown, fallback: string) {
  if (!value || typeof value !== "object") return fallback;
  const message = (value as { error?: unknown }).error;
  return typeof message === "string" ? message : fallback;
}

async function fetchPublicNotes(signal?: AbortSignal) {
  const response = await fetch("/api/notes", {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal,
  });
  const payload: unknown = await response.json();
  if (!response.ok || !isNotesResponse(payload)) {
    throw new Error(errorMessage(payload, "目前無法載入公開留言。"));
  }
  return payload.notes;
}

export function GuestbookBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const notesRef = useRef<BoardNote[]>([...sampleNotes]);
  const [notes, setNotes] = useState<BoardNote[]>([...sampleNotes]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<NoteColor>("yellow");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [pendingNote, setPendingNote] = useState<PendingNote | null>(null);
  const [boardStatus, setBoardStatus] = useState<BoardStatus>("loading");
  const [boardError, setBoardError] = useState("");
  const [publishError, setPublishError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  async function loadNotes(signal?: AbortSignal) {
    try {
      const publicNotes = await fetchPublicNotes(signal);
      notesRef.current = publicNotes;
      setNotes(publicNotes);
      setBoardStatus("ready");
    } catch (error) {
      if (signal?.aborted) return;
      setBoardStatus("error");
      setBoardError(
        error instanceof Error ? error.message : "目前無法載入公開留言。",
      );
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void fetchPublicNotes(controller.signal)
      .then((publicNotes) => {
        if (controller.signal.aborted) return;
        notesRef.current = publicNotes;
        setNotes(publicNotes);
        setBoardStatus("ready");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setBoardStatus("error");
        setBoardError(
          error instanceof Error ? error.message : "目前無法載入公開留言。",
        );
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!pendingNote) return;

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape" && !isPublishing) setPendingNote(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isPublishing, pendingNote]);

  useEffect(() => {
    if (!pendingNote) return;

    let cancelled = false;
    const container = turnstileRef.current;

    function renderWidget() {
      if (cancelled) return;
      const turnstile = getTurnstile();
      if (!turnstile || !container) {
        window.setTimeout(renderWidget, 150);
        return;
      }
      widgetIdRef.current = turnstile.render(container, {
        sitekey: TURNSTILE_SITEKEY,
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    }

    renderWidget();

    return () => {
      cancelled = true;
      const turnstile = getTurnstile();
      if (turnstile && widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      setTurnstileToken("");
    };
  }, [pendingNote]);

  function requestPublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setPublishError("");
    setPendingNote({
      author: author.trim() || "anonymous",
      message: trimmedMessage,
      color,
    });
  }

  async function confirmPublish() {
    if (!pendingNote || isPublishing || !turnstileToken) return;

    setIsPublishing(true);
    setPublishError("");
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pendingNote, turnstileToken }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isNoteResponse(payload)) {
        throw new Error(errorMessage(payload, "目前無法發布留言。"));
      }

      const updatedNotes = [...notesRef.current, payload.note];
      notesRef.current = updatedNotes;
      setNotes(updatedNotes);
      setMessage("");
      setPendingNote(null);
      setBoardStatus("ready");
      setBoardError("");
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "目前無法發布留言。",
      );
      // Turnstile token 是一次性的，失敗後重置 widget 以取得新 token
      const turnstile = getTurnstile();
      if (turnstile && widgetIdRef.current) {
        turnstile.reset(widgetIdRef.current);
      }
      setTurnstileToken("");
    } finally {
      setIsPublishing(false);
    }
  }

  function refreshBoard() {
    setActiveNoteId(null);
    setBoardStatus("loading");
    setBoardError("");
    void loadNotes();
  }

  function updateNotePosition(noteId: string, x: number, y: number) {
    const updatedNotes = notesRef.current.map((note) =>
      note.id === noteId ? { ...note, x, y } : note,
    );
    notesRef.current = updatedNotes;
    setNotes(updatedNotes);
  }

  async function persistPosition(noteId: string, x: number, y: number) {
    try {
      const response = await fetch(`/api/notes/${encodeURIComponent(noteId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        throw new Error(errorMessage(payload, "目前無法儲存便條位置。"));
      }
      setBoardStatus("ready");
      setBoardError("");
    } catch (error) {
      setBoardStatus("error");
      setBoardError(
        error instanceof Error ? error.message : "目前無法儲存便條位置。",
      );
    }
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

    updateNotePosition(
      drag.id,
      clamp(x, 0, drag.maxX),
      clamp(y, 0, drag.maxY),
    );
  }

  function stopDragging(event: PointerEvent<HTMLElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const drag = dragRef.current;
    const note = drag
      ? notesRef.current.find((candidate) => candidate.id === drag.id)
      : null;
    if (note) void persistPosition(note.id, note.x, note.y);
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
    const note = notesRef.current.find((candidate) => candidate.id === noteId);
    if (!note) return;
    const x = clamp(note.x + direction.x * distance, 0, 84);
    const y = clamp(note.y + direction.y * distance, 0, 76);
    setActiveNoteId(noteId);
    updateNotePosition(noteId, x, y);
    void persistPosition(noteId, x, y);
  }

  return (
    <>
      <section className="guestbook-workspace" aria-label="公開訪客留言板">
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
            <button className="reset-board-button" type="button" onClick={refreshBoard}>
              重新載入公開留言
            </button>
          </form>

          <p
            className={`board-status${boardStatus === "error" ? " is-error" : ""}`}
            role="status"
          >
            {boardStatus === "loading"
              ? "CONNECTING / 正在載入公開留言……"
              : boardStatus === "error"
                ? `CONNECTION ERROR / ${boardError}`
                : "PUBLIC BOARD / 所有訪客看到並使用同一個留言板。"}
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
            所有訪客共享同一批便條，也可以拖曳並保存位置；管理功能尚未公開。
          </p>
        </div>
      </section>

      {pendingNote && (
        <div
          className="note-confirmation-backdrop"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget && !isPublishing) {
              setPendingNote(null);
            }
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
              <p>確認後，便條會公開出現在所有訪客的留言板上。發布前仍可返回修改。</p>
              {publishError && <p className="publish-error">{publishError}</p>}
              <div
                ref={turnstileRef}
                className="cf-turnstile"
                style={{ margin: "4px 0" }}
              />
              <div>
                <button
                  type="button"
                  onClick={() => setPendingNote(null)}
                  disabled={isPublishing}
                >
                  返回修改
                </button>
                <button
                  type="button"
                  onClick={confirmPublish}
                  disabled={isPublishing || !turnstileToken}
                  autoFocus
                >
                  {isPublishing
                    ? "正在發布……"
                    : turnstileToken
                      ? "確認貼上"
                      : "請先完成人機驗證"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
