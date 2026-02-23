import C from "../constants/colors";

export default function Card({ children, style, glow, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.bgCard,
        border: `1px solid ${glow ? C.blueBorder : C.border}`,
        borderRadius: C.r,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
