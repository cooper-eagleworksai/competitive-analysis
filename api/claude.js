/**
 * Vercel Serverless Function — Anthropic API Proxy
 * POST /api/claude
 * Body: { system: string, user: string, useSearch?: boolean }
 *
 * Set ANTHROPIC_API_KEY in your Vercel project environment variables.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, user, useSearch } = req.body ?? {};
  if (!system || !user) {
    return res.status(400).json({ error: "Missing system or user prompt" });
  }

  const body = {
    model: "claude-4.6-sonnet",
    max_tokens: 1200,
    system,
    messages: [{ role: "user", content: user }],
  };

  if (useSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("[claude proxy] Anthropic error:", data);
      return res.status(r.status).json({ error: data });
    }

    // Extract all text blocks from the response
    const text = (data.content ?? [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return res.status(200).json({ text });
  } catch (err) {
    console.error("[claude proxy] Fetch error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
