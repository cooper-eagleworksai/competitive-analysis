import C from "../../constants/colors";
import Card from "../../components/Card";
import Lbl from "../../components/Lbl";
import Btn from "../../components/Btn";
import Tag from "../../components/Tag";

export default function OverviewTab({ a, comps, form, pg, setTab }) {
  return (
    <div style={pg}>
      <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 24, padding: "0 4px" }}>
        Explore the tabs above for a preview of your competitive landscape. This is a sample of what a full EagleWorks analysis looks like.
      </p>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <Card style={{ padding: 20, textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }} onClick={() => setTab("competitors")}>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{comps.length}</div>
          <div style={{ fontSize: 10, color: C.textMut, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Competitors ↗</div>
        </Card>
        <Card style={{ padding: 20, textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }} onClick={() => setTab("insights")}>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.amber }}>{a.insights?.length || 5}</div>
          <div style={{ fontSize: 10, color: C.textMut, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Insights ↗</div>
        </Card>
        <Card style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.blue }}>{comps.length * 5 + 8}</div>
          <div style={{ fontSize: 10, color: C.textMut, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sources Scanned</div>
        </Card>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Lbl>Market Positioning</Lbl>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: C.textSec }}>
          {a.positioning || `${form.name} operates in a competitive market in ${form.location} alongside ${comps.length} identified competitors including ${comps[0]?.name || "several established players"}. Your positioning relative to these competitors reveals both strategic opportunities and areas requiring attention. The full report includes detailed positioning analysis across pricing, services, and digital presence.`}
        </p>
      </Card>

      {a.market_overview && (
        <Card style={{ marginBottom: 16 }}>
          <Lbl>Market Overview</Lbl>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: C.textSec }}>{a.market_overview}</p>
        </Card>
      )}

      <Card style={{ marginBottom: 16, background: C.redDim, border: `1px solid ${C.redBorder}` }}>
        <div style={{ marginBottom: 8 }}><Tag color="red">TOP THREAT</Tag></div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: C.textSec }}>
          {a.top_competitor || `${comps[0]?.name || "Your leading competitor"} appears to be the most established player in your ${form.location} market based on web presence and positioning. A detailed threat assessment with scoring across multiple dimensions is available in the full report.`}
        </p>
      </Card>

      <Card>
        <Lbl>Online Reputation Landscape</Lbl>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: C.textSec }}>
          {a.ratings_summary || `The online reputation landscape across ${form.location} businesses varies significantly. Some competitors have invested heavily in Google and Yelp review generation while others have minimal online presence, creating a clear advantage for businesses that prioritize reputation management.`}
        </p>
      </Card>

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
