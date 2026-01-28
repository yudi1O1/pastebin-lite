export async function POST(req) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

 

  const id = crypto.randomUUID().slice(0, 8);


  const host = req.headers.get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/p/${id}`;

  // save paste to redis...

  return Response.json({ id, url });
}
