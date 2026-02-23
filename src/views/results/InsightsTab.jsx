import C from "../../constants/colors";
import Card from "../../components/Card";
import Btn from "../../components/Btn";
import Tag from "../../components/Tag";
import GatedBlur from "../../components/GatedBlur";

export default function InsightsTab({ a, pg, setTab }) {
  const allInsights = a.insights || [];
  const freeInsight = allInsights.find((i) => i.type === "strength") || allInsights[allInsights.length - 1];
  const gatedInsights = allInsights.filter((i) => i !== freeInsight);

  const cm = { opportunity: "green", threat: "red", strength: "blue" };
  const bm = { opportunity: C.greenDim, threat: C.redDim, strength: C.blueDim };
  const bb = { opportunity: C.greenBorder, threat: C.redBorder, strength: C.blueBorder };

  return (
    <div style={pg}>
      {/* Free insight */}
      {freeInsight && (
        <Card style={{ marginBottom: 12, background: bm[freeInsight.type], border: `1px solid ${bb[freeInsight.type]}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Tag color={cm[freeInsight.type]}>{freeInsight.type}</Tag>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{freeInsight.title}</span>
          </div>
          <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7 }}>{freeInsight.text}</p>
        </Card>
      )}

      {/* Gated insights + 90-day plan */}
      <GatedBlur>
        {gatedInsights.map((ins, i) => (
          <Card key={i} style={{ marginBottom: 12, background: bm[ins.type], border: `1px solid ${bb[ins.type]}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Tag color={cm[ins.type]}>{ins.type}</Tag>
              <span style={{ fontWeight: 700 }}>{ins.title}</span>
            </div>
            <p style={{ fontSize: 14, color: C.textSec }}>{ins.text}</p>
          </Card>
        ))}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Tag color="amber">ACTION PLAN</Tag>
            <span style={{ fontWeight: 700 }}>Prioritized 90-Day Roadmap</span>
          </div>
          <p style={{ fontSize: 14, color: C.textSec }}>
            Implementation timeline, impact projections, resource requirements, and step-by-step execution plan tailored to your competitive position.
          </p>
        </Card>
      </GatedBlur>

      {/* Pitch block */}
      <Card style={{ marginTop: 20, border: `1px solid rgba(255,255,255,0.1)` }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>What you just experienced is a sample.</h3>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.75 }}>
          EagleWorks AI builds <strong style={{ color: C.text }}>custom intelligence systems</strong> that do this
          automatically — on a schedule, with change detection, alerts, and interactive dashboards.
          We don't just deliver a report. We build the machine that generates the reports, monitors your market,
          and keeps you ahead.
        </p>
        <p style={{ fontSize: 13, color: C.textMut, marginTop: 12, lineHeight: 1.65 }}>
          Every system is built to your specifications. You tell us what to watch, and we build the AI agent that
          watches it — whether that's competitors, vendors, market trends, or anything else you can find on the web.
        </p>
        <div style={{ marginTop: 16 }}>
          <Btn onClick={() => setTab("services")} variant="secondary" style={{ fontSize: 13 }}>
            See What We Build →
          </Btn>
        </div>
      </Card>
    </div>
  );
}
