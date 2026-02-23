import C from "../constants/colors";
import Steps from "../components/Steps";
import { ANALYSIS_STEPS } from "../constants/data";

export default function Analyzing({ selectedCount, location, analysisStep }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "48px 24px",
    }}>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 24 }}>⚡</div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Running competitive analysis</h2>
        <p style={{ color: C.textSec, fontSize: 14, marginBottom: 32 }}>
          {selectedCount} competitors · {location}
        </p>
        <Steps steps={ANALYSIS_STEPS} current={analysisStep} />
      </div>
    </div>
  );
}
