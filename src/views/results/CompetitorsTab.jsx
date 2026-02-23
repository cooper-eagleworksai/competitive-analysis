import C from "../../constants/colors";
import Card from "../../components/Card";
import Lbl from "../../components/Lbl";
import Tag from "../../components/Tag";
import GatedBlur from "../../components/GatedBlur";

export default function CompetitorsTab({ comps, form, pg }) {
  return (
    <div style={pg}>
      {/* Your business */}
      <Card glow style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{form.name}</span>
          <Tag color="blue">YOU</Tag>
        </div>
        {form.website && <div style={{ fontSize: 13, color: C.blue, marginTop: 4 }}>{form.website}</div>}
        <div style={{ fontSize: 13, color: C.textMut, marginTop: 4 }}>{form.location}</div>
      </Card>

      {/* Competitor list */}
      {comps.map((c, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
          {c.website && <div style={{ fontSize: 13, color: C.blue, marginTop: 2 }}>{c.website}</div>}
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6, marginTop: 4 }}>{c.description}</div>
          {c.location && <div style={{ fontSize: 12, color: C.textMut, marginTop: 6 }}>📍 {c.location}</div>}
        </Card>
      ))}

      {/* Gated pricing matrix */}
      <GatedBlur>
        <Card style={{ marginTop: 16 }}>
          <Lbl>Service & Pricing Comparison Matrix</Lbl>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Company", "Pricing", "Booking", "Reviews", "Rating"].map((h) => (
                  <th key={h} style={{ padding: 10, textAlign: "left", fontSize: 11, color: C.textMut }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[form.name, ...comps.slice(0, 4).map((c) => c.name)].map((n) => (
                <tr key={n} style={{ borderBottom: `1px solid ${C.border}` }}>
                  {[n, "Yes", "Yes", "52", "4.5"].map((v, i) => (
                    <td key={i} style={{ padding: 10, fontSize: 13, fontWeight: i === 0 ? 600 : 400 }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </GatedBlur>
    </div>
  );
}
