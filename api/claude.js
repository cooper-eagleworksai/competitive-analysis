/**
 * Vercel Serverless Function — Anthropic API Proxy
 * POST /api/claude
 * Body: { system: string, user: string, useSearch?: boolean }
 *
 * Set ANTHROPIC_API_KEY in your Vercel project environment variables.
 * Locally, vercel dev doesn't always inject .env.local into serverless
 * functions, so we load it explicitly as a fallback.
 */
try { process.loadEnvFile(".env.local"); } catch {}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, user, useSearch, location } = req.body ?? {};
  if (!system || !user) {
    return res.status(400).json({ error: "Missing system or user prompt" });
  }
  if (typeof system !== "string" || system.length > 2000) {
    return res.status(400).json({ error: "Invalid request." });
  }
  if (typeof user !== "string" || user.length > 5000) {
    return res.status(400).json({ error: "Invalid request." });
  }
  if (location && (typeof location !== "string" || location.length > 200)) {
    return res.status(400).json({ error: "Invalid request." });
  }

  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system,
    messages: [{ role: "user", content: user }],
  };

  if (useSearch) {
    const searchTool = { type: "web_search_20250305", name: "web_search" };
    if (location) {
      searchTool.user_location = { type: "approximate", region: location };
    }
    body.tools = [searchTool];
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
      const status = r.status;
      const msg =
        status === 401 ? "API configuration error. Please contact support." :
        status === 429 ? "Too many requests. Please wait a moment and try again." :
        status === 529 ? "The analysis service is temporarily overloaded. Please try again shortly." :
        "Analysis failed. Please try again.";
      return res.status(status).json({ error: msg });
    }

    // Extract all text blocks from the response
    const text = (data.content ?? [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return res.status(200).json({ text });
  } catch (err) {
    console.error("[claude proxy] Fetch error:", err);
    return res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
}
