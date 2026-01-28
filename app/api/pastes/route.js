import { redis } from "../../../../lib/redis";
import { getNow } from "../../../../lib/time";

export async function GET(req, { params }) {
  const paste = await redis.get(`paste:${params.id}`);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(req);

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Increment views
  paste.views += 1;
  await redis.set(`paste:${params.id}`, paste);

  return Response.json({
    content: paste.content,
    views: paste.views,
    remaining_views:
      paste.max_views === null ? null : paste.max_views - paste.views,
    expires_at: paste.expires_at,
  });
}
