import C from "../constants/colors";

export default function Btn({ children, onClick, disabled, variant = "primary", style: s }) {
  const base = {
    border: "none", borderRadius: C.r, fontSize: 14, fontWeight: 600,
    cursor: disabled ? "default" : "pointer", transition: "all 0.2s",
    letterSpacing: "0.01em", fontFamily: "inherit",
  };
  const styles = {
    primary:   { ...base, padding: "14px 32px", background: C.text,        color: C.bg,      opacity: disabled ? 0.3 : 1, ...s },
    secondary: { ...base, padding: "12px 24px", background: "transparent", color: C.textSec, border: `1px solid ${C.border}`, ...s },
    amber:     { ...base, padding: "16px 40px", background: C.amber,       color: C.bg,      fontSize: 15, fontWeight: 700, ...s },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={styles[variant]}>
      {children}
    </button>
  );
}
