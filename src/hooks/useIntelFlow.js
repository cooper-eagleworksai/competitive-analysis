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

    const sys = `You are a competitive intelligence analyst. Based on the competitor information provided, give a strategic assessment. Return ONLY valid JSON — no markdown, no backticks, no explanation:
{
  "positioning": "3 sentence assessment of the company's competitive position",
  "insights": [
    {"type":"opportunity","title":"short title","text":"2-3 sentence specific insight using competitor names"},
    {"type":"opportunity","title":"short title","text":"2-3 sentence insight"},
    {"type":"threat","title":"short title","text":"2-3 sentence insight using competitor names"},
    {"type":"threat","title":"short title","text":"2-3 sentence insight"},
    {"type":"strength","title":"short title","text":"2-3 sentence insight"}
  ],
  "ratings_summary": "2 sentences about the reputation landscape",
  "top_competitor": "2 sentences naming the top threat and why",
  "market_overview": "2 sentences about market dynamics"
}`;

    const usr = `Analyze this competitive landscape:

COMPANY: ${form.name} (${form.website || "no website"})

LOCATION: ${form.location}

COMPETITORS FOUND:
${compDetails}

Based on this information, provide a strategic competitive assessment. Focus on positioning, opportunities, threats, and actionable insights. Reference specific competitor names.`;

    const raw = await callClaude(sys, usr, 60000, false);

    if (forceCompleted) return;
    forceCompleted = true;
    clearTimeout(safetyTimer);
    clearInterval(iv);
    analysisIvRef.current = null;
    setAnalysisStep(ANALYSIS_STEPS.length - 1);

    let data = parseJSON(raw);

    if (data) {
      const top = confirmed[0]?.name || "your primary competitor";
      if (!data.positioning || data.positioning.length < 20)
        data.positioning = `${form.name} operates in a competitive market in ${form.location} alongside ${confirmed.length} identified competitors. Your positioning relative to ${top} and others reveals both strategic opportunities and areas requiring attention. The full report includes detailed positioning analysis across pricing, services, and digital presence.`;
      if (!data.top_competitor || data.top_competitor.length < 20)
        data.top_competitor = `${top} appears to be the most established player in your ${form.location} market based on web presence and positioning. A detailed threat assessment with scoring across multiple dimensions is available in the full report.`;
      if (!data.ratings_summary || data.ratings_summary.length < 20)
        data.ratings_summary = `The online reputation landscape across ${form.location} businesses varies significantly. Some competitors have invested heavily in Google and Yelp review generation while others have minimal online presence, creating a clear advantage for businesses that prioritize reputation management.`;
      if (!data.market_overview || data.market_overview.length < 20)
        data.market_overview = `The local market in ${form.location} shows active competition with room for differentiation. Both established players and newer entrants are vying for market share through different strategies.`;
      if (!data.insights || !Array.isArray(data.insights) || data.insights.length === 0)
        data.insights = buildFallbackInsights(confirmed, form);

      setResults({ analysis: data, competitors: confirmed });
      stampFlowUsed();
      setTimeout(() => { setView("results"); setTab("overview"); }, 600);
    } else {
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
  return [
    { type: "opportunity", title: "Digital Presence Gap",  text: `Several competitors in ${form.location} have underdeveloped online presence. A strategic investment in SEO, review generation, and content marketing could capture significant discovery-phase traffic.` },
    { type: "opportunity", title: "Service Differentiation", text: `Our scan identified potential service gaps among your ${confirmed.length} competitors. Businesses that fill unaddressed needs early can establish category ownership before competitors react.` },
    { type: "threat",      title: "Competitive Density",   text: `${top} and ${confirmed.length - 1} other businesses are competing for the same customers in ${form.location}. Monitoring their moves and differentiating clearly is critical.` },
    { type: "threat",      title: "Review Momentum",       text: `Some competitors are building review velocity faster than others, which directly impacts local search rankings and customer trust.` },
    { type: "strength",    title: "Intelligence Advantage", text: `By actively monitoring moves from ${top} and ${confirmed.length - 1} others, you can anticipate pricing changes, service expansions, and marketing pushes before they impact your pipeline. Most businesses in ${form.location} operate reactively — this gives you first-mover advantage on counter-positioning.` },
  ];
}


