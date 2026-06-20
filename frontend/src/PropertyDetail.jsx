import EligibilityPanel from "./EligibilityPanel";
import LendersPanel from "./LendersPanel";

const usd = (n) => "$" + n.toLocaleString();

// Mock buyer until a real profile form exists. Steered low-income for demo impact.
const demoProfile = {
  income: 42000, householdSize: 4, firstTimeBuyer: true,
  veteran: false, savings: 3500,
};

export default function PropertyDetail({ property: p, onBack }) {
  return (
    <>
      <button className="back" onClick={onBack}>← All homes</button>
      <div className="detail">
        <div>
          <img src={p.photo} alt={p.address} />
          <h2>{usd(p.price)}</h2>
          <div className="addr">{p.address}, {p.city}, {p.state} {p.zip}</div>

          <div className="panel" style={{ marginTop: 18 }}>
            <h3>Home</h3>
            <div className="row"><span>Bedrooms</span><b>{p.beds}</b></div>
            <div className="row"><span>Bathrooms</span><b>{p.baths}</b></div>
            <div className="row"><span>Size</span><b>{p.sqft.toLocaleString()} sqft</b></div>
            <div className="row"><span>Type</span><b>{p.propertyType}</b></div>
            <div className="row"><span>County</span><b>{p.county}</b></div>
          </div>
        </div>

        <div>
          <div className="panel">
            <h3>Your profile</h3>
            <div className="row"><span>Household income</span><b>{usd(demoProfile.income)}</b></div>
            <div className="row"><span>Household size</span><b>{demoProfile.householdSize}</b></div>
            <div className="row"><span>First-time buyer</span><b>{demoProfile.firstTimeBuyer ? "Yes" : "No"}</b></div>
            <div className="row"><span>Savings</span><b>{usd(demoProfile.savings)}</b></div>
          </div>

          {/* Person 2 fills this */}
          <EligibilityPanel property={p} profile={demoProfile} />
          {/* Person 3 fills this */}
          <LendersPanel property={p} profile={demoProfile} />
        </div>
      </div>
    </>
  );
}
