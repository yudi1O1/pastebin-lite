import { headers } from "next/headers";

async function getPaste(id) {
  const headersList = headers();
  const host = headersList.get("host");

  // Detect protocol safely
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function PastePage({ params }) {
  const data = await getPaste(params.id);

  if (!data) {
    return <h1>404 – Paste not found or expired</h1>;
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>Paste</h2>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {data.content}
      </pre>
    </main>
  );
}
