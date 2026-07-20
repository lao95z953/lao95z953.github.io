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

function readId(params) {
  return Array.isArray(params.id) ? params.id[0] : params.id;
}

export async function onRequestPatch({ request, env, params }) {
  if (!isTrustedMutation(request)) {
    return json({ error: "不允許從其他網站移動便條。" }, 403);
  }

  const id = readId(params);
  if (typeof id !== "string" || !id || id.length > 64) {
    return json({ error: "便條識別碼不正確。" }, 400);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "位置格式不正確。" }, 400);
  }

  const x = Number(payload.x);
  const y = Number(payload.y);
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100) {
    return json({ error: "便條位置超出留言板範圍。" }, 400);
  }

  try {
    const result = await env.DB.prepare(
      `UPDATE guestbook_notes
       SET x = ?, y = ?, updated_at = ?
       WHERE id = ?`,
    )
      .bind(x, y, new Date().toISOString(), id)
      .run();

    if (!result.meta.changes) {
      return json({ error: "找不到這張便條。" }, 404);
    }

    return json({ ok: true });
  } catch (error) {
    console.error("Unable to move guestbook note", error);
    return json({ error: "目前無法儲存便條位置。" }, 500);
  }
}
