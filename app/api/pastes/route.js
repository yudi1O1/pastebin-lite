import { nanoid } from "nanoid";
import { redis } from "../../../lib/redis";
import { getNow } from "../../../lib/time";


export async function POST(req) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return Response.json({ error: "Invalid ttl" }, { status: 400 });
  }

  if (max_views && max_views < 1) {
    return Response.json({ error: "Invalid views" }, { status: 400 });
  }

  const id = nanoid(8);
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

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}
