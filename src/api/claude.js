/**
 * Client-side API utility.
 * Routes calls through the Vercel serverless proxy (/api/claude)
 * so the Anthropic key is never exposed in the browser bundle.
 */
export async function callClaude(
  sysPrompt,
  userPrompt,
  timeoutMs = 60000,
  useSearch = true,
  location = null
) {
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve("__TIMEOUT__"), timeoutMs);
  });

  const fetchPromise = (async () => {
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: sysPrompt, user: userPrompt, useSearch, location }),
      });
      const data = await res.json();
      if (data.error) {
        console.error("API error from proxy:", data.error);
        return null;
      }
      return data.text ?? null;
    } catch (e) {
      console.error("Fetch error:", e);
      return null;
    }
  })();

  return Promise.race([fetchPromise, timeoutPromise]);
}

export function parseJSON(text) {
  if (!text || text === "__TIMEOUT__") return null;
  try {
    const arr = text.match(/\[[\s\S]*\]/);
    if (arr) return JSON.parse(arr[0]);
    const obj = text.match(/\{[\s\S]*\}/);
    if (obj) return JSON.parse(obj[0]);
  } catch { /* */ }
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch { /* */ }
  return null;
}
