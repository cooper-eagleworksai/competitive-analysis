import C from "../constants/colors";
import Btn from "../components/Btn";
import Lbl from "../components/Lbl";

export default function Confirm({
  pg, competitors, selected, extra, apiErr,
  onToggle, onExtraChange, onAddExtra, onBack, onAnalyze, inp,
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 24px", minHeight: "100vh",
    }}>
      <div style={{ ...pg, maxWidth: 560, width: "100%" }}>
        {/* Progress bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 48 }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ flex: 1, height: 2, borderRadius: 1, background: s <= 2 ? C.text : C.border }} />
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          {apiErr ? "Add your competitors" : `We found ${competitors.length} competitors`}
        </h2>
        <p style={{ color: C.textSec, marginBottom: 32, fontSize: 15 }}>
          {apiErr ? "Add the competitors you'd like analyzed." : "Select which to include. Add any we missed."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {competitors.map((c) => {
            const on = selected.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => onToggle(c.id)}
                style={{
                  display: "flex", gap: 14, padding: "16px 18px", borderRadius: C.r, cursor: "pointer",
                  background: on ? "rgba(255,255,255,0.04)" : C.bgCard,
                  border: `1px solid ${on ? "rgba(255,255,255,0.15)" : C.border}`,
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  border: `2px solid ${on ? C.text : C.border}`, background: on ? C.text : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                }}>
                  {on && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={C.bg}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 1 }}>{c.name}</div>
                  {c.website && <div style={{ fontSize: 12, color: C.blue, marginBottom: 3 }}>{c.website}</div>}
                  <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{c.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual add */}
        <div style={{ marginBottom: 28 }}>
          <Lbl>Add a competitor</Lbl>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              style={{ ...inp, flex: 1 }}
              value={extra}
              onChange={(e) => onExtraChange(e.target.value)}
              placeholder="Company name"
              onKeyDown={(e) => e.key === "Enter" && onAddExtra()}
            />
            <Btn variant="secondary" onClick={onAddExtra}>+ Add</Btn>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Btn variant="secondary" onClick={onBack}>← Back</Btn>
          <Btn onClick={onAnalyze} disabled={selected.length === 0}>
            Analyze {selected.length} Competitor{selected.length !== 1 ? "s" : ""} →
          </Btn>
        </div>
      </div>
    </div>
  );
}
