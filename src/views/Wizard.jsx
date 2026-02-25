import C from "../constants/colors";
import Btn from "../components/Btn";
import { SCHEDULE_URL } from "../constants/data";

export default function Wizard({ pg, form, onChange, onBack, onScan, rateLimited, inp }) {
  const ok = form.name && form.location;
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 24px", minHeight: "100vh",
    }}>
      <div style={{ ...pg, maxWidth: 480, width: "100%" }}>
        {/* Progress bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 48 }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ flex: 1, height: 2, borderRadius: 1, background: s <= 1 ? C.text : C.border }} />
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>About your business</h2>
        <p style={{ color: C.textSec, marginBottom: 36, fontSize: 15, lineHeight: 1.6 }}>
          We'll search the web to find your top 5–10 competitors. You can add specific ones too.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {[
            { key: "name",     label: "Company Name", ph: "e.g. EagleWorks AI",  req: true  },
            { key: "website",  label: "Website URL",  ph: "e.g. eagleworksai.com" },
            { key: "location", label: "City & State",  ph: "e.g. Auburn, AL",    req: true  },
          ].map((f) => (
            <div key={f.key}>
              <label style={{
                fontSize: 11, fontWeight: 600, color: C.textMut, marginBottom: 6,
                display: "block", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                {f.label} {f.req && "*"}
              </label>
              <input
                style={inp}
                value={form[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.ph}
              />
            </div>
          ))}
        </div>

        {rateLimited && (
          <div style={{
            marginTop: 28, borderRadius: C.r, padding: "20px 22px", textAlign: "center",
            background: "rgba(232, 163, 56, 0.08)", border: `1px solid rgba(232, 163, 56, 0.25)`,
          }}>
            <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>
              You've used your free scan for today
            </p>
            <p style={{ color: C.textSec, fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>
              Come back tomorrow for another free snapshot, or schedule a call to get the full competitive report now.
            </p>
            <Btn variant="amber" onClick={() => window.open(SCHEDULE_URL, "_blank")}>
              Schedule a Call →
            </Btn>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: rateLimited ? 20 : 40 }}>
          <Btn variant="secondary" onClick={onBack}>← Back</Btn>
          <Btn onClick={onScan} disabled={!ok || rateLimited}>Scan My Market →</Btn>
        </div>
      </div>
    </div>
  );
}
