import { useState, useEffect, useCallback, useRef } from "react";
import { callClaude, parseJSON } from "../api/claude";
import { SCAN_STEPS, ANALYSIS_STEPS } from "../constants/data";

const RATE_LIMIT_KEY = "ew_last_flow";
const ONE_DAY_MS     = 24 * 60 * 60 * 1000;
const RATE_LIMIT_OFF = process.env.REACT_APP_DISABLE_RATE_LIMIT === "true";

function isRateLimited() {
  if (RATE_LIMIT_OFF) return false;
  try {
    const last = parseInt(localStorage.getItem(RATE_LIMIT_KEY), 10);
    return last && (Date.now() - last) < ONE_DAY_MS;
  } catch { return false; }
}

function stampFlowUsed() {
  if (RATE_LIMIT_OFF) return;
  try { localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString()); } catch {}
}

/**
 * Central state + action hook for the EagleWorks Intel flow.
 * Keeps EagleWorksIntel.jsx as a thin view-router.
 */
export default function useIntelFlow() {
  // ── UI state ──
  const [view,          setView         ] = useState("landing");
  const [fade,          setFade         ] = useState(false);
  const [tab,           setTab          ] = useState("overview");
  const [rateLimited,   setRateLimited  ] = useState(false);

  // ── Form ──
  const [form, setForm] = useState({ name: "", website: "", location: "" });

  // ── Scan / discover ──
  const [scanStep,      setScanStep     ] = useState(0);
  const [competitors,   setCompetitors  ] = useState([]);
  const [selected,      setSelected     ] = useState([]);
  const [extra,         setExtra        ] = useState("");
  const [apiErr,        setApiErr       ] = useState(false);
  const [apiErrMsg,     setApiErrMsg    ] = useState("");

  // ── Analysis ──
  const [analysisStep,  setAnalysisStep ] = useState(0);
  const [results,       setResults      ] = useState(null);
  const [usedFallback,  setUsedFallback ] = useState(false);

  // ── Interval refs (for cleanup on unmount) ──
  const scanIvRef     = useRef(null);
  const analysisIvRef = useRef(null);

  // ── CTA / email ──
  const [email,         setEmail        ] = useState("");
  const [submitted,     setSubmitted    ] = useState(false);
  const [submitting,    setSubmitting   ] = useState(false);
  const [submitErr,     setSubmitErr    ] = useState("");

  // Fade-in on view change
  useEffect(() => {
    setFade(false);
    const t = setTimeout(() => setFade(true), 40);
    return () => clearTimeout(t);
  }, [view]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (scanIvRef.current) clearInterval(scanIvRef.current);
      if (analysisIvRef.current) clearInterval(analysisIvRef.current);
    };
  }, []);

  // ── Form helpers ──
  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ── Competitor list helpers ──
  const toggle = (id) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const addExtra = () => {
    if (!extra.trim()) return;
    const c = {
      id: competitors.length,
      name: extra.trim(),
      website: null,
      description: "Added manually.",
      location: form.location,
    };
    setCompetitors((p) => [...p, c]);
    setSelected((p) => [...p, c.id]);
    setExtra("");
  };

  // ── DISCOVER ──
  const runDiscover = useCallback(async () => {
    if (isRateLimited()) {
      setRateLimited(true);
      return;
    }
    setRateLimited(false);
    setView("scanning");
    setScanStep(0);
    setApiErr(false);
    setApiErrMsg("");

    const iv = setInterval(
      () => setScanStep((p) => Math.min(p + 1, SCAN_STEPS.length - 1)),
      3000
    );
    scanIvRef.current = iv;

    const sys = `You are a competitive intelligence researcher. Find real, currently operating competitors. Return ONLY a JSON array, no markdown or backticks. Each object: {"name":"string","website":"string or null","description":"2 sentences","location":"string"}. Return 6-10 competitors. Verify they are real businesses.`;
    const usr = `Find 6-10 real competitors for: ${form.name} (${form.website || "no website"}), ${form.location}. Search the web and return real businesses with actual website URLs.`;

    const raw = await callClaude(sys, usr, 60000, true, form.location);
    clearInterval(iv);
    scanIvRef.current = null;
    setScanStep(SCAN_STEPS.length - 1);

    if (raw === "__TIMEOUT__") {
      setApiErr(true);
      setApiErrMsg("The search took longer than expected. You can retry or add competitors manually.");
      setTimeout(() => setView("confirm"), 500);
      return;
    }

    const parsed = parseJSON(raw);
    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      const comps = parsed.map((c, i) => ({ ...c, id: i }));
      setCompetitors(comps);
      setSelected(comps.map((c) => c.id));
      setTimeout(() => setView("confirm"), 500);
    } else {
      setApiErr(true);
      setApiErrMsg(raw === null
        ? "Something went wrong reaching our analysis service. You can retry or add competitors manually."
        : "We couldn't parse competitor data. You can retry or add competitors manually.");
      setTimeout(() => setView("confirm"), 500);
    }
  }, [form]);

  // ── ANALYZE ──
  const runAnalysis = useCallback(async () => {
    setView("analyzing");
    setAnalysisStep(0);
    setUsedFallback(false);

    const iv = setInterval(
      () => setAnalysisStep((p) => Math.min(p + 1, ANALYSIS_STEPS.length - 1)),
      2200
    );
    analysisIvRef.current = iv;

    const confirmed    = competitors.filter((c) => selected.includes(c.id));

    // Build a complete fallback result object from available data
    function buildFallback() {
      const top = confirmed[0]?.name || "your primary competitor";
      return {
        positioning: `${form.name} operates in a competitive market in ${form.location} alongside ${confirmed.length} identified competitors. Your positioning relative to ${top} and others reveals both strategic opportunities and areas requiring attention.`,
        insights:    buildFallbackInsights(confirmed, form),
        ratings_summary: `The online reputation landscape across ${form.location} businesses varies significantly. Some competitors invest heavily in review generation while others have minimal online presence.`,
        top_competitor:  `${top} appears to be the most established player in your ${form.location} market. A detailed threat assessment is available in the full report.`,
        market_overview: `The local market in ${form.location} shows active competition with room for differentiation.`,
      };
    }

    let forceCompleted = false;
    const safetyTimer = setTimeout(() => {
      if (!forceCompleted) {
        forceCompleted = true;
        clearInterval(iv);
        analysisIvRef.current = null;
        setAnalysisStep(ANALYSIS_STEPS.length - 1);
        setUsedFallback(true);
        setResults({ analysis: buildFallback(), competitors: confirmed });
        stampFlowUsed();
        setTimeout(() => { setView("results"); setTab("overview"); }, 600);
      }
    }, 75000);
    const compDetails  = confirmed
      .map((c) => `- ${c.name}${c.website ? ` (${c.website})` : ""}: ${c.description || "no details"}`)
      .join("\n");

      const sys = `You are a calm, accurate competitive intelligence analyst working from limited public data — website content, search results, and online reviews. Your job is to give a grounded, signal-based snapshot, not a definitive market study.

Return ONLY valid JSON — no markdown, no backticks, no explanation:
{
  "positioning": "2-3 sentences. How the company appears to fit into this competitive landscape based on available signals. Be neutral and appropriately hedged.",
  "insights": [
    {"type":"opportunity|threat|strength","title":"Short title","text":"2 sentences max. Name a specific competitor, describe what the public data suggests, recommend one concrete action."}
  ],
  "ratings_summary": "2 sentences about the visible reputation landscape based on reviews and ratings found. Acknowledge that review counts may be low.",
  "top_competitor": "2 sentences. Name the most significant competitor based on visible signals and explain what makes them worth watching — not a definitive verdict.",
  "market_overview": "2-3 sentences. Describe apparent market dynamics based on this competitor set and publicly available information."
}

RULES:
- Exactly 5 insights, 2 sentences each
- Choose types based on the data — do not default to threats
- Every insight names a specific competitor
- Assume the subject company is competent and established
- Use hedged language throughout: "appears to," "based on available data," "publicly visible," "signals suggest" — never state conclusions as established fact
- A competitor with a few strong reviews is not "highly rated" — say "shows strong early reviews" or "holds a 4.8 rating across X reviews"
- Avoid: "dominates," "monopoly," "must," "risks being overlooked," "dangerous," "strong competitor," "high customer satisfaction" as absolute claims
- If data is thin, still provide your best analysis based on available signals — just use language like "based on limited visible data" or "from what's publicly available." Never refuse to analyze or tell the user conclusions would be premature. Always give them something useful.`;

    const usr = `Analyze this competitive landscape for ${form.name}:

COMPANY: ${form.name} (${form.website || "no website"})
LOCATION: ${form.location}

COMPETITORS:
${compDetails}

Based on these competitors, provide a strategic competitive assessment. Name specific competitors in every insight. What should ${form.name} actually do differently based on who they're up against?`;

    const raw = await callClaude(sys, usr, 60000, false);

    if (forceCompleted) { console.error("[ANALYSIS] Safety timer already fired — response came back too late"); return; }
    forceCompleted = true;
    clearTimeout(safetyTimer);
    clearInterval(iv);
    analysisIvRef.current = null;
    setAnalysisStep(ANALYSIS_STEPS.length - 1);

    let data = parseJSON(raw);

    if (data) {
      if (!data.insights || !Array.isArray(data.insights) || data.insights.length === 0) {
        console.warn("[ANALYSIS] Insights array missing/empty in Claude response, using fallback insights");
        data.insights = buildFallbackInsights(confirmed, form);
      }
      console.log("[ANALYSIS] USING CLAUDE RESPONSE — positioning:", data.positioning?.slice(0, 100));
      setResults({ analysis: data, competitors: confirmed });
      stampFlowUsed();
      setTimeout(() => { setView("results"); setTab("overview"); }, 600);
    } else {
      console.error("[ANALYSIS] USING FULL FALLBACK — parseJSON returned null (see errors above for why)");
      setUsedFallback(true);
      setResults({ analysis: buildFallback(), competitors: confirmed });
      stampFlowUsed();
      setTimeout(() => { setView("results"); setTab("overview"); }, 600);
    }
  }, [competitors, selected, form]); // eslint-disable-line

  // ── Email submit ──
  const onSubmitEmail = useCallback(async () => {
    if (!email.includes("@") || submitting) return;
    setSubmitting(true);
    setSubmitErr("");

    try {
      const compNames = (results?.competitors || []).map((c) => c.name);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: form.name,
          website: form.website || "",
          location: form.location,
          competitors: compNames,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
      } else {
        setSubmitErr(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitErr("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [email, form, results, submitting]);

  // ── Animation style ──
  const pg = {
    opacity: fade ? 1 : 0,
    transform: fade ? "translateY(0)" : "translateY(8px)",
    transition: "all 0.4s ease",
  };

  return {
    // state
    view, setView, pg, rateLimited,
    form, onChange,
    scanStep,
    competitors, selected, extra, setExtra, apiErr, apiErrMsg,
    analysisStep,
    results, usedFallback,
    tab, setTab,
    email, setEmail,
    submitted, submitting, submitErr, setSubmitErr,
    // actions
    runDiscover,
    runAnalysis,
    toggle,
    addExtra,
    onSubmitEmail,
  };
}

// ── Helpers ──
function buildFallbackInsights(confirmed, form) {
  const top = confirmed[0]?.name || "your primary competitor";
  const second = confirmed[1]?.name || "other local competitors";
  return [
    { type: "opportunity", title: `Gaps in ${form.location} Market`,  text: `With ${confirmed.length} competitors identified in ${form.location}, there are likely underserved niches. Review ${top}'s and ${second}'s service pages to identify offerings they don't provide, then target those gaps first.` },
    { type: "opportunity", title: "Review Volume Opportunity", text: `Check the Google review counts for ${top} and ${second}. If any competitor has fewer than 50 reviews, an aggressive review-generation campaign could help you outrank them in local search within 3-6 months.` },
    { type: "threat",      title: `${top}'s Market Position`,   text: `${top} appears to be the strongest competitor in ${form.location}. Visit their website and note their pricing, key services, and customer testimonials — then build a comparison page highlighting where ${form.name} offers more value.` },
    { type: "threat",      title: "Pricing Pressure",       text: `With ${confirmed.length} businesses competing in ${form.location}, pricing pressure is likely. Research what ${second} charges for similar services and decide whether to compete on price or differentiate on quality and specialization.` },
    { type: "strength",    title: "Competitive Awareness", text: `Most businesses in ${form.location} don't actively track their competitors. By monitoring ${top}, ${second}, and ${confirmed.length - 2 > 0 ? confirmed.length - 2 + " others" : "others"}, you can spot their pricing changes, new service launches, and marketing campaigns before they affect your pipeline.` },
  ];
}


