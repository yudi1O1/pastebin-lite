import { redis } from "../../../lib/redis";


export async function GET() {
  await redis.ping();
  return Response.json({ ok: true });
}
