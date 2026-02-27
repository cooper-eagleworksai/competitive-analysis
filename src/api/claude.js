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
  const label = sysPrompt.includes("intelligence analyst") ? "ANALYSIS" : "DISCOVERY";
  console.log(`[${label}] >>> API call starting (useSearch=${useSearch}, timeout=${timeoutMs}ms, sysPrompt=${sysPrompt.length} chars, userPrompt=${userPrompt.length} chars)`);

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      console.error(`[${label}] >>> TIMED OUT after ${timeoutMs}ms — Claude took too long to respond`);
      resolve("__TIMEOUT__");
    }, timeoutMs);
  });

  const fetchPromise = (async () => {
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: sysPrompt, user: userPrompt, useSearch, location }),
      });
      console.log(`[${label}] >>> HTTP response status: ${res.status}`);
      const data = await res.json();
      if (data.error) {
        console.error(`[${label}] >>> SERVER RETURNED ERROR: "${data.error}"`);
        return null;
      }
      if (!data.text) {
        console.error(`[${label}] >>> SERVER RETURNED EMPTY TEXT (data.text is "${data.text}")`);
        return null;
      }
      console.log(`[${label}] >>> Got response text (${data.text.length} chars)`);
      return data.text;
    } catch (e) {
      console.error(`[${label}] >>> FETCH FAILED:`, e.message);
      return null;
    }
  })();

  const result = await Promise.race([fetchPromise, timeoutPromise]);
  if (result === "__TIMEOUT__") console.error(`[${label}] >>> Final result: TIMEOUT`);
  else if (result === null) console.error(`[${label}] >>> Final result: NULL (API call failed — check errors above)`);
  else console.log(`[${label}] >>> Final result: OK (${result.length} chars)`);
  return result;
}

export function parseJSON(text) {
  if (!text || text === "__TIMEOUT__") return null;
  console.log(`[parseJSON] input (${text.length} chars): ${text.slice(0, 500)}`);
  try {
    const obj = text.match(/\{[\s\S]*\}/);
    if (obj) { const p = JSON.parse(obj[0]); console.log("[parseJSON] parsed as object, keys:", Object.keys(p)); return p; }
  } catch (e) { console.log("[parseJSON] object regex failed:", e.message); }
  try {
    const arr = text.match(/\[[\s\S]*\]/);
    if (arr) { const p = JSON.parse(arr[0]); console.log("[parseJSON] parsed as array, length:", p.length); return p; }
  } catch (e) { console.log("[parseJSON] array regex failed:", e.message); }
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); } catch {}
  console.error("[parseJSON] ALL PARSE ATTEMPTS FAILED");
  return null;
}
