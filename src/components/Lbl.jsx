import C from "../constants/colors";

export default function Lbl({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.12em", color: C.textMut, marginBottom: 14,
    }}>
      {children}
    </div>
  );
}
