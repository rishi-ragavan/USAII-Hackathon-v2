import { getRates } from "./rates";
import InfoNote from "./InfoNote";

const usd = (n) => "$" + Math.round(n).toLocaleString();

// Defensible constants (national averages — cite to judges):
const RATE = 0.065;          // 30yr fixed, annual
const TERM = 360;            // months
const PMI_RATE = 0.007;      // PMI /yr when <20% down
const UTIL_FIXED = 0.3;      // EIA: ~30% of a utility bill is size-independent
// Property tax, insurance & climate are now per-state (see rates.js).

// Utilities rescaled from the family's ACTUAL current bill, not a model.
function estimateUtilities(currentUtil, currentSqft, newSqft, climate = 1) {
  if (!currentSqft) return currentUtil;
  return currentUtil * (UTIL_FIXED + (1 - UTIL_FIXED) * (newSqft / currentSqft)) * climate;
}

export default function MonthlyCost({ property: p, profile }) {
  const newRates = getRates(p.state);
  const curRates = getRates(profile.currentState || p.state);
  const climate = newRates.climate / curRates.climate; // 1.0 if same climate zone

  const down = Math.min(profile.savings || 0, p.price);
  const loan = Math.max(0, p.price - down);
  const r = RATE / 12;
  const pi = loan > 0 ? (loan * r) / (1 - (1 + r) ** -TERM) : 0;
  const tax = (p.price * newRates.tax) / 12;
  const ins = (p.price * newRates.ins) / 12;
  const pmi = down / p.price < 0.2 ? (loan * PMI_RATE) / 12 : 0;
  const util = estimateUtilities(profile.currentUtilities, profile.currentSqft, p.sqft, climate);
  const newTotal = pi + tax + ins + pmi + util;

  const nowTotal = (profile.currentRent || 0) + (profile.currentUtilities || 0);
  const diff = newTotal - nowTotal;

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Monthly cost — now vs this home</h3>
        <InfoNote>
          This compares what you spend on housing <b>today</b> with what this home would cost
          each month. <b>“You pay now”</b> is your current rent plus utility bills. For the new
          home we add up your <b>loan payment</b> (the mortgage), <b>property taxes</b>,
          <b> home insurance</b>, <b>PMI</b> (an extra fee lenders charge when your down payment
          is under 20%), and your <b>estimated utility bills</b> for a home this size. The last
          line shows whether this home costs <b>more</b> (red) or <b>less</b> (green) per month
          than you pay today.
        </InfoNote>
      </div>
      <div className="row"><span>You pay now (rent + utilities)</span><b>{usd(nowTotal)}/mo</b></div>
      <div className="row"><span>Mortgage P&amp;I</span><b>{usd(pi)}</b></div>
      <div className="row"><span>Property tax</span><b>{usd(tax)}</b></div>
      <div className="row"><span>Insurance</span><b>{usd(ins)}</b></div>
      {pmi > 0 && <div className="row"><span>PMI (under 20% down)</span><b>{usd(pmi)}</b></div>}
      <div className="row"><span>Utilities (rescaled from your bill)</span><b>{usd(util)}</b></div>
      <div className="row" style={{ borderTop: "1px solid var(--line)", marginTop: 4 }}>
        <span><b>This home, total</b></span><b>{usd(newTotal)}/mo</b>
      </div>
      <div className="row" style={{ borderBottom: "none" }}>
        <span>vs. today</span>
        <b style={{ color: diff > 0 ? "var(--coral)" : "var(--green)" }}>
          {diff > 0 ? "+" : "−"}{usd(Math.abs(diff))}/mo
        </b>
      </div>
      <p className="stub">
        Tax &amp; insurance use {p.state} state averages. Utilities scaled by floor area
        ({p.sqft.toLocaleString()} vs your {profile.currentSqft || "—"} sqft)
        {climate !== 1 && ` and climate (${(climate).toFixed(2)}× for ${profile.currentState}→${p.state})`}.
      </p>
    </div>
  );
}
