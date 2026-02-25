/**
 * Vercel Serverless Function — Lead Capture
 * POST /api/lead
 * Body: { email, name, website, location, competitors }
 *
 * Forwards lead data to a Google Sheets Apps Script webhook.
 * Set GOOGLE_SHEET_WEBHOOK_URL in your Vercel project environment variables.
 */
try { process.loadEnvFile(".env.local"); } catch {}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, website, location, competitors } = req.body ?? {};

  if (!email || !email.includes("@") || !name) {
    return res.status(400).json({ error: "Email and company name are required." });
  }

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[lead] GOOGLE_SHEET_WEBHOOK_URL is not configured");
    return res.status(500).json({ error: "Lead capture is not configured." });
  }

  try {
    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        website: website || "",
        location: location || "",
        competitors: Array.isArray(competitors) ? competitors : [],
      }),
    });

    if (!r.ok) {
      console.error("[lead] Webhook error:", r.status, await r.text().catch(() => ""));
      return res.status(502).json({ error: "Failed to record lead. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[lead] Fetch error:", err);
    return res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
}
