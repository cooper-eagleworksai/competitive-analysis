import C from "../constants/colors";
import EWLogo from "../components/EWLogo";
import Btn from "../components/Btn";

export default function Landing({ pg, onStart }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "48px 24px",
    }}>
      <div style={{ ...pg, maxWidth: 640, textAlign: "center" }}>
        <div style={{ marginBottom: 48 }}><EWLogo size={50} /></div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.1,
          marginBottom: 20, letterSpacing: "-0.03em",
        }}>
          See Your Competitive<br />Landscape. In Real Time.
        </h1>
        <p style={{ fontSize: 18, color: C.textSec, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 16px" }}>
          Enter your business details and our AI will search the web to find your
          competitors, analyze their positioning, and surface strategic insights.
        </p>
        <p style={{ fontSize: 14, color: C.textMut, marginBottom: 44 }}>
          Real competitors. Real data. Powered by live AI research.
        </p>

        <Btn onClick={onStart} style={{ padding: "18px 52px", fontSize: 16 }}>
          Analyze My Market →
        </Btn>

        <p style={{ fontSize: 12, color: C.textMut, marginTop: 20 }}>
          Free competitive snapshot · No credit card · Takes about 90 seconds
        </p>

        <div style={{ width: 40, height: 1, background: C.border, margin: "48px auto 32px" }} />

        <p style={{ fontSize: 13, color: C.textMut, maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
          This is a sample of what EagleWorks AI builds for businesses —<br />
          automated intelligence systems that run on your schedule.
        </p>
      </div>
    </div>
  );
}
