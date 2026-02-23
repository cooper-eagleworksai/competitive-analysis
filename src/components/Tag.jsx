import C from "../constants/colors";

export default function Tag({ color = "blue", children }) {
  const m = {
    blue:  { bg: C.blueDim,  bd: C.blueBorder,  c: C.blue  },
    green: { bg: C.greenDim, bd: C.greenBorder, c: C.green },
    red:   { bg: C.redDim,   bd: C.redBorder,   c: C.red   },
    amber: { bg: C.amberDim, bd: C.amberBorder, c: C.amber },
  };
  const s = m[color] || m.blue;
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 4,
      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.08em", background: s.bg,
      border: `1px solid ${s.bd}`, color: s.c,
    }}>
      {children}
    </span>
  );
}
