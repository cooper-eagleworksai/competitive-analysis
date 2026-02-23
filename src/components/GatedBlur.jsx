import C from "../constants/colors";

export default function GatedBlur({ children }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(5px)", opacity: 0.3, pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "rgba(12,12,12,0.5)", borderRadius: C.r,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.amber, fontWeight: 700, fontSize: 13 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Full Report Required
        </div>
      </div>
    </div>
  );
}
