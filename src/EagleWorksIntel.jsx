import "./styles/global.css";
import C from "./constants/colors";
import useIntelFlow from "./hooks/useIntelFlow";
import Landing   from "./views/Landing";
import Wizard    from "./views/Wizard";
import Scanning  from "./views/Scanning";
import Confirm   from "./views/Confirm";
import Analyzing from "./views/Analyzing";
import Results   from "./views/results/Results";

/** Shared input style used in Wizard, Confirm, and Results. */
const inp = {
  width: "100%",
  padding: "14px 16px",
  background: C.bgElevated,
  border: `1px solid ${C.border}`,
  borderRadius: C.r,
  color: C.text,
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};

/** Full-page dark shell. */
const Shell = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}
  >
    {children}
  </div>
);

export default function EagleWorksIntel() {
  const flow = useIntelFlow();

  if (flow.view === "landing")
    return (
      <Shell>
        <Landing pg={flow.pg} onStart={() => flow.setView("wizard")} />
      </Shell>
    );

  if (flow.view === "wizard")
    return (
      <Shell>
        <Wizard
          pg={flow.pg}
          form={flow.form}
          onChange={flow.onChange}
          onBack={() => flow.setView("landing")}
          onScan={flow.runDiscover}
          rateLimited={flow.rateLimited}
          inp={inp}
        />
      </Shell>
    );

  if (flow.view === "scanning")
    return (
      <Shell>
        <Scanning form={flow.form} scanStep={flow.scanStep} />
      </Shell>
    );

  if (flow.view === "confirm")
    return (
      <Shell>
        <Confirm
          pg={flow.pg}
          competitors={flow.competitors}
          selected={flow.selected}
          extra={flow.extra}
          apiErr={flow.apiErr}
          apiErrMsg={flow.apiErrMsg}
          onToggle={flow.toggle}
          onExtraChange={flow.setExtra}
          onAddExtra={flow.addExtra}
          onBack={() => flow.setView("wizard")}
          onAnalyze={flow.runAnalysis}
          onRetry={flow.runDiscover}
          inp={inp}
        />
      </Shell>
    );

  if (flow.view === "analyzing")
    return (
      <Shell>
        <Analyzing
          selectedCount={flow.selected.length}
          location={flow.form.location}
          analysisStep={flow.analysisStep}
        />
      </Shell>
    );

  if (flow.view === "results" && flow.results)
    return (
      <Shell>
        <Results
          pg={flow.pg}
          results={flow.results}
          usedFallback={flow.usedFallback}
          form={flow.form}
          tab={flow.tab}
          setTab={flow.setTab}
          email={flow.email}
          submitted={flow.submitted}
          submitting={flow.submitting}
          submitErr={flow.submitErr}
          onEmailChange={(v) => { flow.setEmail(v); flow.setSubmitErr(""); }}
          onSubmitEmail={flow.onSubmitEmail}
          inp={inp}
        />
      </Shell>
    );

  // Fallback / loading
  return (
    <Shell>
      <div style={{ padding: 48, textAlign: "center", color: C.textSec }}>
        Loading…
      </div>
    </Shell>
  );
}
