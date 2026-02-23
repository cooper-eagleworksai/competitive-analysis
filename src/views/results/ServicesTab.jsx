import C from "../../constants/colors";
import Card from "../../components/Card";
import Lbl from "../../components/Lbl";
import Btn from "../../components/Btn";
import { PRICING_TIERS, SERVICE_IDEAS, SCHEDULE_URL } from "../../constants/data";

export default function ServicesTab({ pg }) {
  return (
    <div style={pg}>
      {/* Intro */}
      <Card style={{ marginBottom: 28, border: `1px solid rgba(255,255,255,0.1)` }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>What you just experienced is a sample.</h3>
        <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.75 }}>
          EagleWorks AI builds <strong style={{ color: C.text }}>custom intelligence systems</strong> that do this
          automatically — on a schedule, with change detection, alerts, and interactive dashboards.
          We don't just deliver a report. We build the machine that generates the reports, monitors your market,
          and keeps you ahead.
        </p>
        <p style={{ fontSize: 14, color: C.textMut, marginTop: 12, lineHeight: 1.65 }}>
          Every system is built to your specifications. You tell us what to watch, and we build the AI agent that
          watches it — whether that's competitors, vendors, market trends, or anything else you can find on the web.
        </p>
      </Card>

      {/* Pricing Tiers */}
      <Lbl>Service Options</Lbl>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 36 }}>
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.name}
            style={{
              padding: 0, overflow: "hidden",
              border: tier.highlight ? `1px solid rgba(255,255,255,0.2)` : `1px solid ${C.border}`,
            }}
          >
            {tier.highlight && (
              <div style={{
                background: C.text, color: C.bg, textAlign: "center", padding: "6px 0",
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
              }}>
                Most Popular
              </div>
            )}
            <div style={{ padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textMut, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{tier.name}</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{tier.price}</div>
              <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6, marginBottom: 18 }}>{tier.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tier.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 8, fontSize: 13, color: C.textSec }}>
                    <span style={{ color: C.green, flexShrink: 0 }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Btn
                onClick={() => window.open(SCHEDULE_URL, "_blank")}
                style={{
                  width: "100%", marginTop: 20, padding: "12px 0", textAlign: "center",
                  background: tier.highlight ? C.text : "transparent",
                  color: tier.highlight ? C.bg : C.text,
                  border: tier.highlight ? "none" : `1px solid ${C.border}`,
                }}
              >
                {tier.cta}
              </Btn>
            </div>
          </Card>
        ))}
      </div>

      {/* Other Ideas */}
      <Lbl>Other Intelligence Systems We Build</Lbl>
      <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7, marginBottom: 20 }}>
        Competitive analysis is just one application. The same approach — automated web scraping, AI-powered
        analysis, and interactive reporting — works for any business intelligence need:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 36 }}>
        {SERVICE_IDEAS.map((idea) => (
          <Card key={idea.title} style={{ padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{idea.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{idea.title}</div>
            <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>{idea.desc}</p>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <Card style={{ textAlign: "center", padding: 32, marginBottom: 20 }}>
        <Lbl>How It Works</Lbl>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", marginTop: 8 }}>
          {[
            { n: "1", t: "Strategy Call",  d: "Tell us what you want to track" },
            { n: "2", t: "We Build It",     d: "Custom AI agent, deployed in 2–4 weeks" },
            { n: "3", t: "It Runs",         d: "Scheduled or on-demand — forever" },
          ].map((s) => (
            <div key={s.n} style={{ textAlign: "center", maxWidth: 150 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${C.text}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px", fontWeight: 700, fontSize: 15,
              }}>{s.n}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 12, color: C.textSec }}>{s.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
