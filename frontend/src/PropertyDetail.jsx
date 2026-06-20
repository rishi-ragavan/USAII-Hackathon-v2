import EligibilityPanel from "./EligibilityPanel";
import LendersPanel from "./LendersPanel";
import PriceHistory from "./PriceHistory";

const usd = (n) => "$" + n.toLocaleString();

export default function PropertyDetail({ property: p, profile, onBack }) {
  return (
    <>
      <button className="back" onClick={onBack}>← All homes</button>
      <div className="detail">
        <div>
          <img className="heroimg" src={p.photo} alt={p.address} />
          <h2>{usd(p.price)}</h2>
          <div className="addr">{p.address}, {p.city}, {p.state} {p.zip}</div>

          <div className="panel" style={{ marginTop: 18 }}>
            <h3>Home facts</h3>
            <div className="row"><span>Bedrooms</span><b>{p.beds}</b></div>
            <div className="row"><span>Bathrooms</span><b>{p.baths}</b></div>
            <div className="row"><span>Size</span><b>{p.sqft.toLocaleString()} sqft</b></div>
            <div className="row"><span>Price / sqft</span><b>{usd(Math.round(p.price / p.sqft))}</b></div>
            <div className="row"><span>Type</span><b>{p.propertyType}</b></div>
            <div className="row"><span>County</span><b>{p.county}</b></div>
          </div>

          <PriceHistory property={p} />
        </div>

        <div>
          <div className="panel">
            <h3>Your profile</h3>
            <div className="row"><span>Household income</span><b>{usd(profile.income)}</b></div>
            <div className="row"><span>Household size</span><b>{profile.householdSize}</b></div>
            <div className="row"><span>First-time buyer</span><b>{profile.firstTimeBuyer ? "Yes" : "No"}</b></div>
            <div className="row"><span>Savings</span><b>{usd(profile.savings)}</b></div>
            <div className="row"><span>Current rent + utilities</span><b>{usd(profile.currentRent + profile.currentUtilities)}/mo</b></div>
          </div>

          {/* Person 2 fills this */}
          <EligibilityPanel property={p} profile={profile} />
          {/* Person 3 fills this */}
          <LendersPanel property={p} profile={profile} />
        </div>
      </div>
    </>
  );
}
