import C from "../../constants/colors";
import Tag from "../../components/Tag";
import Btn from "../../components/Btn";
import EWLogo from "../../components/EWLogo";
import { SCHEDULE_URL } from "../../constants/data";
import OverviewTab from "./OverviewTab";
import CompetitorsTab from "./CompetitorsTab";
import InsightsTab from "./InsightsTab";
import ServicesTab from "./ServicesTab";

const TABS = [
  { id: "overview",     label: "Overview" },
  { id: "competitors",  label: "Competitors" },
  { id: "insights",     label: "Insights" },
  { id: "services",     label: "What We Build" },
];

export default function Results({ pg, results, form, tab, setTab, email, setEmail, submitted, onSubmitEmail, inp }) {
  const a     = results.analysis;
  const comps = results.competitors;

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "24px 24px 20px" }}>
        <div style={{
          maxWidth: 860, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <EWLogo size={30} />
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700 }}>{form.name}</h1>
              <p style={{ color: C.textMut, fontSize: 12, marginTop: 1 }}>
                {form.location} · {comps.length} competitors
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Tag color="blue">FREE SNAPSHOT</Tag>
            <div style={{ fontSize: 11, color: C.textMut, marginTop: 4 }}>
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky tab bar */}
      <div style={{ borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.bg, zIndex: 10 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", overflowX: "auto", padding: "0 24px" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "14px 20px", background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: tab === t.id ? 600 : 400, fontFamily: "inherit",
                color: tab === t.id ? C.text : C.textMut,
                borderBottom: `2px solid ${tab === t.id ? C.text : "transparent"}`,
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px" }}>

        {tab === "overview"    && <OverviewTab    a={a} comps={comps} form={form} pg={pg} setTab={setTab} />}
        {tab === "competitors" && <CompetitorsTab comps={comps} form={form} pg={pg} />}
        {tab === "insights"    && <InsightsTab    a={a} pg={pg} setTab={setTab} />}
        {tab === "services"    && <ServicesTab    pg={pg} />}

        {/* ── CTA Block (shared) ── */}
        <div style={{
          marginTop: 32, borderRadius: C.r, padding: 36, textAlign: "center",
          background: C.bgCard, border: `1px solid ${C.border}`,
        }}>
          {!submitted ? (
            <>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Get the Full Competitive Report</h3>
              <p style={{ color: C.textSec, fontSize: 15, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.65 }}>
                Detailed service comparisons, pricing intelligence, reputation deep-dives, and a prioritized action plan.
              </p>
              <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto 20px", flexWrap: "wrap", justifyContent: "center" }}>
                <input
                  style={{ ...inp, flex: "1 1 220px", textAlign: "center" }}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Btn
                  onClick={onSubmitEmail}
                  disabled={!email.includes("@")}
                  style={{ flex: "0 0 auto", padding: "14px 24px" }}
                >
                  Send Report
                </Btn>
              </div>
              <div style={{ color: C.textMut, fontSize: 13, marginBottom: 20 }}>— or —</div>
              <Btn variant="amber" onClick={() => window.open(SCHEDULE_URL, "_blank")}>
                Schedule a Call
              </Btn>
              <p style={{ fontSize: 12, color: C.textMut, marginTop: 12 }}>
                30 minutes · No obligation · Includes full competitive report
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 14 }}>✓</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.green, marginBottom: 8 }}>Report Request Received</h3>
              <p style={{ color: C.textSec, fontSize: 14, maxWidth: 380, margin: "0 auto 24px" }}>
                We'll send your full analysis to <strong style={{ color: C.text }}>{email}</strong> within 24 hours.
              </p>
              <Btn variant="amber" onClick={() => window.open(SCHEDULE_URL, "_blank")}>
                Want it faster? Schedule a Call →
              </Btn>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <EWLogo size={28} />
          <p style={{ fontSize: 12, color: C.textMut, marginTop: 10 }}>Practical AI. No Hype. Just ROI.</p>
          <p style={{ fontSize: 11, color: C.textMut, marginTop: 4 }}>© 2025 EagleWorks AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
