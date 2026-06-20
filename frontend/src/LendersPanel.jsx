import InfoNote from "./InfoNote";

// PERSON 3: lenders + rates, ranked for the buyer.
// Reliable demo version: APR is built from a market benchmark, adjusted for the
// buyer's credit score and each lender's spread, then ranked. Real-data upgrade:
// query CFPB HMDA by property.censusTract for actual lenders + originated rates.
const BENCHMARK = 6.8; // Freddie Mac PMMS 30yr national avg (%), labeled in UI
const RATE_FALLBACK_TERM = 360;

// FICO-based rate pricing (realistic adjustments to the benchmark).
function creditAdj(score) {
  if (score >= 760) return -0.4;
  if (score >= 700) return -0.1;
  if (score >= 680) return 0.1;
  if (score >= 640) return 0.5;
  return 1.2;
}

const usd = (n) => "$" + Math.round(n).toLocaleString();
const monthlyPI = (loan, aprPct) => {
  const r = aprPct / 100 / 12;
  return loan > 0 ? (loan * r) / (1 - (1 + r) ** -RATE_FALLBACK_TERM) : 0;
};

export default function LendersPanel({ property: p, profile }) {
  const adj = creditAdj(profile.creditScore ?? 680);
  const down = Math.min(profile.savings || 0, p.price);
  const loan = Math.max(0, p.price - down);

  const lenders = [
    { name: "Local Credit Union", spread: -0.25, note: "Member-owned, low fees" },
    { name: "Rocket Mortgage", spread: -0.10, note: "Fast online approval" },
    { name: "Bank of America", spread: -0.05, note: "First-time buyer grants" },
    { name: "Chase Bank", spread: 0.05, note: "Relationship discounts" },
    { name: "Wells Fargo", spread: 0.10, note: "Wide branch network" },
    { name: `${p.state} Housing Finance Agency`, spread: -0.40,
      note: "Down-payment assistance", firstTimeOnly: true },
  ]
    .filter((l) => !l.firstTimeOnly || profile.firstTimeBuyer)
    .map((l) => {
      const apr = +(BENCHMARK + adj + l.spread).toFixed(2);
      return { ...l, apr, monthly: monthlyPI(loan, apr) };
    })
    .sort((a, b) => a.apr - b.apr);

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Lenders near you</h3>
        <InfoNote>
          These are mortgage lenders ranked by the <b>interest rate</b> we estimate you'd get,
          based on your <b>credit score</b> ({profile.creditScore ?? 680}). A lower rate means a
          lower monthly payment for the same home. <b>“P&amp;I”</b> is your loan payment
          (principal + interest). The <b>green “Best rate”</b> lender is the cheapest option for you.
        </InfoNote>
      </div>
      <p className="stub" style={{ marginTop: 0 }}>
        Market average is {BENCHMARK}%. Ranked for your credit ({profile.creditScore ?? 680}).
      </p>

      <div className="program-list">
        {lenders.map((l, i) => (
          <div key={l.name} className={"program-card " + (i === 0 ? "qualified" : "")}>
            <div className="program-header">
              <span className="program-name">
                {l.name}{i === 0 && <span className="best-tag">Best rate</span>}
              </span>
              <span className="program-rate">{l.apr}% APR</span>
            </div>
            <div className="program-body">
              <div className="p-row"><span>{l.note}</span><b>{usd(l.monthly)}/mo P&amp;I</b></div>
              <div className="p-row details">
                <span>{l.apr < BENCHMARK
                  ? `${(BENCHMARK - l.apr).toFixed(2)}% below market`
                  : `${(l.apr - BENCHMARK).toFixed(2)}% above market`}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
