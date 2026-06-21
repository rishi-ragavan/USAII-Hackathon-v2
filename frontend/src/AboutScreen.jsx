// Judge-facing showcase. Frames Homestead against the brief (navigate public systems)
// and the responsible-AI requirements (risk, mitigation, human-in-the-loop).
export default function AboutScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <h1>What Homestead does</h1>
        <p>People miss housing help not because it doesn't exist — but because the system is too
          hard to navigate. Homestead makes eligibility, affordability, and aid clear for first-time
          and lower-income buyers.</p>
      </div>

      <div className="panel">
        <h3>How it works</h3>
        <div className="row"><span>1 · Input</span><b>Your income, household, savings, status</b></div>
        <div className="row"><span>2 · Reasoning</span><b>Rules-based eligibility + real affordability math</b></div>
        <div className="row"><span>3 · Output</span><b>Homes ranked for you, programs you qualify for, true monthly cost</b></div>
        <div className="row"><span>4 · Action</span><b>Apply with the right program</b></div>
      </div>

      <div className="panel">
        <h3>Responsible AI</h3>
        <div className="row"><span>Risk</span><b>Over-reliance / false certainty on money & legal eligibility</b></div>
        <div className="row"><span>Mitigation</span><b>Every figure is your own data or a labeled estimate; we show why you <i>don't</i> qualify too</b></div>
        <div className="row"><span>Human in the loop</span><b>We never approve a loan or make the final call — a lender or HUD counselor does</b></div>
        <div className="row" style={{ borderBottom: "none" }}>
          <span>Not advice</span><b>Estimates only — not financial or legal advice</b></div>
      </div>

      <div className="panel">
        <h3>Data sources</h3>
        <p className="stub">Program rules from HUD, USDA, VA, and FHA guidelines; tax/insurance/climate
          from national & per-state public averages. Listings shown are demo data.</p>
      </div>
    </div>
  );
}
