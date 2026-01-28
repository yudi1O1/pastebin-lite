"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreatePaste() {
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create paste");
      }

      const data = await res.json();
      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        rows={8}
        style={{ width: "100%" }}
        placeholder="Paste your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          placeholder="TTL seconds (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          placeholder="Max views (optional)"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
        />
      </div>

      <button
        onClick={handleCreatePaste}
        disabled={loading}
        style={{ marginTop: 15 }}
      >
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultUrl && (
        <p>
          Paste URL:{" "}
          <a href={resultUrl} target="_blank" rel="noreferrer">
            {resultUrl}
          </a>
        </p>
      )}
    </main>
  );
}
