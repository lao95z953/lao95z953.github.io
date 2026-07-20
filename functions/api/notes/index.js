const allowedColors = new Set(["yellow", "pink", "blue", "green"]);
const maximumNotes = 200;

function json(value, status = 200) {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// 變更類請求必須帶相符的 Origin（瀏覽器 fetch POST/PATCH 一定會帶）
function isTrustedMutation(request) {
  const origin = request.headers.get("Origin");
  return origin === new URL(request.url).origin;
}

async function verifyTurnstile(env, token, ip) {
  // 尚未設定機密時「放行」，方便分階段上線；
  // 只要 TURNSTILE_SECRET 沒設，等於沒有防護，別忘了在 Cloudflare Pages 設定。
  if (!env.TURNSTILE_SECRET) return true;
  if (typeof token !== "string" || !token) return false;
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form },
    );
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

function randomBetween(minimum, maximum) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  const ratio = values[0] / 0xffffffff;
  return minimum + ratio * (maximum - minimum);
}

function roundPosition(value) {
  return Math.round(value * 100) / 100;
}

function noteFromRow(row) {
  return {
    id: row.id,
    author: row.author,
    message: row.message,
    color: row.color,
    x: row.x,
    y: row.y,
    rotation: row.rotation,
    date: row.created_at.slice(5, 10).replace("-", "."),
    pinned: Boolean(row.pinned),
  };
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, author, message, color, x, y, rotation, pinned, created_at
       FROM guestbook_notes
       ORDER BY pinned DESC, created_at ASC
       LIMIT ?`,
    )
      .bind(maximumNotes)
      .all();

    return json({ notes: results.map(noteFromRow) });
  } catch (error) {
    console.error("Unable to load guestbook notes", error);
    return json({ error: "目前無法載入留言，請稍後再試。" }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  if (!isTrustedMutation(request)) {
    return json({ error: "不允許從其他網站發布留言。" }, 403);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "留言格式不正確。" }, 400);
  }

  const author = typeof payload.author === "string" ? payload.author.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const color = typeof payload.color === "string" ? payload.color : "";
  const normalizedAuthor = author || "anonymous";

  if (normalizedAuthor.length > 24) {
    return json({ error: "署名最多 24 個字。" }, 400);
  }
  if (!message || message.length > 140) {
    return json({ error: "留言需要是 1 到 140 個字。" }, 400);
  }
  if (!allowedColors.has(color)) {
    return json({ error: "便條顏色不正確。" }, 400);
  }

  const clientIp = request.headers.get("CF-Connecting-IP");
  if (!(await verifyTurnstile(env, payload.turnstileToken, clientIp))) {
    return json({ error: "驗證失敗，請重新完成人機驗證後再送出。" }, 403);
  }

  try {
    const countRow = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM guestbook_notes",
    ).first();
    if (Number(countRow?.count ?? 0) >= maximumNotes) {
      return json({ error: "留言板目前已滿，請稍後再試。" }, 409);
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const note = {
      id,
      author: normalizedAuthor,
      message,
      color,
      x: roundPosition(randomBetween(5, 74)),
      y: roundPosition(randomBetween(8, 62)),
      rotation: Math.round(randomBetween(-2, 2)),
      date: createdAt.slice(5, 10).replace("-", "."),
      pinned: false,
    };

    await env.DB.prepare(
      `INSERT INTO guestbook_notes
       (id, author, message, color, x, y, rotation, pinned, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    )
      .bind(
        note.id,
        note.author,
        note.message,
        note.color,
        note.x,
        note.y,
        note.rotation,
        createdAt,
        createdAt,
      )
      .run();

    return json({ note }, 201);
  } catch (error) {
    console.error("Unable to publish guestbook note", error);
    return json({ error: "目前無法發布留言，請稍後再試。" }, 500);
  }
}
