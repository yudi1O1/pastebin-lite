export const runtime = "nodejs";

import { redis } from "../../../lib/redis";
import { getNow } from "../../../lib/time";

export async function GET(req, { params }) {
  const { id } = params;

  const paste = await redis.get(`paste:${id}`);

  if (!paste) {
    return Response.json({ error: "Paste not found" }, { status: 404 });
  }

  const now = getNow(req);

  if (paste.expires_at && now >= paste.expires_at) {
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  const updatedPaste = {
    ...paste,
    views: paste.views + 1,
  };

  await redis.set(`paste:${id}`, updatedPaste);

  return Response.json({
    content: updatedPaste.content,
    views: updatedPaste.views,
    remaining_views:
      updatedPaste.max_views === null
        ? null
        : updatedPaste.max_views - updatedPaste.views,
    expires_at: updatedPaste.expires_at,
  });
}
