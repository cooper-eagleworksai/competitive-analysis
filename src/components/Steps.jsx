import C from "../constants/colors";

export default function Steps({ steps, current }) {
  return (
    <div style={{ textAlign: "left" }}>
      {steps.map((label, i) => (
        <div
          key={i}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "10px 0", opacity: i <= current ? 1 : 0.2, transition: "opacity 0.5s",
          }}
        >
          {i < current ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={C.green}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          ) : i === current ? (
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: `2px solid ${C.text}`, borderTopColor: "transparent",
              animation: "ew-spin 0.7s linear infinite",
            }} />
          ) : (
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: `1px solid ${C.border}`,
            }} />
          )}
          <span style={{
            fontSize: 14, color: i <= current ? C.text : C.textMut,
            fontWeight: i === current ? 600 : 400,
          }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
