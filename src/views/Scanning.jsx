import C from "../constants/colors";
import Steps from "../components/Steps";
import { SCAN_STEPS } from "../constants/data";

export default function Scanning({ form, scanStep }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "48px 24px",
    }}>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        {/* Radar SVG */}
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ marginBottom: 32 }}>
          <circle cx="36" cy="36" r="32" fill="none" stroke={C.border} strokeWidth="0.5" />
          <circle cx="36" cy="36" r="22" fill="none" stroke={C.border} strokeWidth="0.5" />
          <circle cx="36" cy="36" r="12" fill="none" stroke={C.border} strokeWidth="0.5" />
          <circle cx="36" cy="36" r="2.5" fill={C.text} />
          <line x1="36" y1="36" x2="36" y2="4" stroke={C.text} strokeWidth="1.5" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" from="0 36 36" to="360 36 36" dur="2.5s" repeatCount="indefinite" />
          </line>
          {[{ x: 52, y: 18, r: 3 }, { x: 20, y: 50, r: 2.5 }, { x: 56, y: 48, r: 2 }].map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={C.text} opacity="0.5">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Scanning {form.location}</h2>
        <p style={{ color: C.textSec, fontSize: 14, marginBottom: 32 }}>Finding competitors for {form.name}…</p>
        <Steps steps={SCAN_STEPS} current={scanStep} />
      </div>
    </div>
  );
}
