export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redis } from "../../lib/redis";
import { getNow } from "../../lib/time";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    return Response.json({ error: "Invalid ttl" }, { status: 400 });
  }

  if (max_views !== undefined && max_views < 1) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = crypto.randomUUID().slice(0, 8);
  const now = getNow(req);
  const expires_at = ttl_seconds ? now + ttl_seconds * 1000 : null;

  const paste = {
    id,
    content,
    created_at: now,
    expires_at,
    max_views: max_views ?? null,
    views: 0,
  };

  await redis.set(`paste:${id}`, paste);

  const host = req.headers.get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  return Response.json({
    id,
    url: `${protocol}://${host}/p/${id}`,
  });
}
