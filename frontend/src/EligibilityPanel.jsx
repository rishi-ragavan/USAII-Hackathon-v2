import { useEffect, useState } from "react";
import { leave } from "./linkout";

const usd = (n) => "$" + Math.round(n).toLocaleString();
const pct = (n) => (n * 100).toFixed(1) + "%";

// Plain-language blurb + official link, shown when a program card is clicked.
const PROGRAM_INFO = {
  va: { blurb: "Backed by the VA for veterans and active-duty military. 0% down and no monthly mortgage insurance.",
    url: "https://www.va.gov/housing-assistance/home-loans/" },
  usda: { blurb: "Backed by the USDA for homes in eligible rural and small-town areas. 0% down, with household income limits.",
    url: "https://www.rd.usda.gov/programs-services/single-family-housing-programs" },
  fha: { blurb: "Government-insured loan with just 3.5% down and a credit score as low as 580 — the most common first-time-buyer path.",
    url: "https://www.hud.gov/buying/loans" },
  homeready: { blurb: "Fannie Mae loan for lower-income buyers: 3% down with reduced mortgage insurance.",
    url: "https://www.fanniemae.com/education/homeready-mortgage" },
  conv20: { blurb: "A standard loan with 20% down and no mortgage insurance — the lowest monthly cost if you can cover the down payment.",
    url: "https://www.consumerfinance.gov/owning-a-home/loan-options/conventional-loans/" },
  gnnd: { blurb: "Teachers, police, firefighters, and EMTs can buy eligible HUD-listed homes at 50% off the list price.",
    url: "https://www.hud.gov/program_offices/housing/sfh/reo/goodn/gnndabout" },
};

export default function EligibilityPanel({ property, profile }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);

  const Detail = ({ id }) => {
    const info = PROGRAM_INFO[id];
    if (!info || open !== id) return null;
    return (
      <div className="prog-detail">
        <p>{info.blurb}</p>
        <a className="prog-link" href={info.url} onClick={leave(info.url)}>Apply / learn more ↗</a>
      </div>
    );
  };
  const toggle = (id) => setOpen(open === id ? null : id);

  useEffect(() => {
    let active = true;
    
    async function checkEligibility() {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          user: {
            income: parseFloat(profile.income),
            credit_score: parseInt(profile.creditScore ?? 680),
            savings: parseFloat(profile.savings),
            monthly_debt: parseFloat(profile.monthlyDebt ?? 0),
            family_size: parseInt(profile.householdSize ?? 1),
            is_veteran: !!profile.veteran,
            is_first_time_buyer: !!profile.firstTimeBuyer,
            profession: profile.profession ?? "other"
          },
          property: {
            price: parseFloat(property.price),
            zip_code: String(property.zip),
            county: String(property.county),
            state: String(property.state),
            is_rural: property.zip === "31794" || property.zip === "50014",
            is_hud_owned: property.id === "oh-002"
          }
        };

        const res = await fetch("http://localhost:8000/eligibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Backend API error");
        
        const json = await res.json();
        if (active) setData(json);
      } catch (err) {
        if (active) setError("Could not connect to backend server.");
      } finally {
        if (active) setLoading(false);
      }
    }

    checkEligibility();

    return () => { active = false; };
  }, [property, profile]);

  if (loading) return <div className="panel"><p className="status">Calculating aid options...</p></div>;
  if (error) return <div className="panel error"><p className="status-err">{error}</p></div>;
  if (!data) return null;

  const getAffordabilityClass = (status) => {
    if (status === "AFFORDABLE") return "status-affordable";
    if (status === "STRETCHED") return "status-stretched";
    return "status-overburdened";
  };

  return (
    <div className="panel">
      <h3>Affordability Analysis</h3>
      <div className={`status-banner ${getAffordabilityClass(data.is_affordable)}`}>
        <div className="banner-title">
          {data.is_affordable === "AFFORDABLE" && "🏡 Good Budget Match"}
          {data.is_affordable === "STRETCHED" && "⚠️ Budget is Stretched"}
          {data.is_affordable === "OVERBURDENED" && "🚨 High Financial Risk"}
        </div>
        <div className="banner-desc">
          Max recommended monthly: <b>{usd(data.max_affordable_monthly_payment)}</b> (28% limit)
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Programs You Qualify For ({data.qualified_programs.length})</h3>
      {data.qualified_programs.length === 0 ? (
        <p className="stub">You do not qualify for any special programs for this property. Consider increasing down payment or savings.</p>
      ) : (
        <div className="program-list">
          {data.qualified_programs.map((p) => (
            <div key={p.program_id} className="program-card qualified clickable"
              onClick={() => toggle(p.program_id)}>
              <div className="program-header">
                <span className="program-name">{p.name}</span>
                <span className="program-rate">{p.interest_rate}% APR</span>
              </div>
              <div className="program-body">
                <div className="p-row">
                  <span>Down Payment Needed:</span>
                  <b className={p.required_down_payment === 0 ? "zero" : ""}>
                    {p.required_down_payment === 0 ? "0% Down!" : usd(p.required_down_payment)}
                  </b>
                </div>
                <div className="p-row">
                  <span>Monthly Payment:</span>
                  <b>{usd(p.monthly_total)}/mo</b>
                </div>
                <div className="p-row details">
                  <span>P&I: {usd(p.monthly_p_and_i)} | PMI: {usd(p.monthly_pmi)} | Tax/Ins: {usd(p.monthly_tax + p.monthly_insurance)}</span>
                </div>
                <div className="p-row">
                  <span>Back-end DTI:</span>
                  <b>{pct(p.dti_ratio)}</b>
                </div>
              </div>
              <Detail id={p.program_id} />
            </div>
          ))}
        </div>
      )}

      {data.unqualified_programs.length > 0 && (
        <>
          <h3 style={{ marginTop: 24 }}>Other Programs Checked ({data.unqualified_programs.length})</h3>
          <div className="program-list unqualified-list">
            {data.unqualified_programs.map((p) => (
              <div key={p.program_id} className="program-card unqualified clickable"
                onClick={() => toggle(p.program_id)}>
                <div className="program-header">
                  <span className="program-name">{p.name}</span>
                  <span className="badge-not-eligible">Not Qualified</span>
                </div>
                <p className="reason-text">{p.reason}</p>
                <Detail id={p.program_id} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

