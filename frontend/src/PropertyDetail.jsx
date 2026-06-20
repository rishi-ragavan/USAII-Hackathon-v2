import { useState } from "react";
import EligibilityPanel from "./EligibilityPanel";
import LendersPanel from "./LendersPanel";

const usd = (n) => "$" + n.toLocaleString();

export default function PropertyDetail({ property: p, onBack }) {
  const [profile, setProfile] = useState({
    income: 42000,
    householdSize: 4,
    firstTimeBuyer: true,
    veteran: false,
    savings: 12000,
    creditScore: 680,
    monthlyDebt: 250,
    profession: "teacher" // preset to teacher so GNND can show easily
  });

  const updateProfile = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <button className="back" onClick={onBack}>← All homes</button>
      <div className="detail">
        <div>
          <img src={p.photo} alt={p.address} />
          <h2>{usd(p.price)}</h2>
          <div className="addr">{p.address}, {p.city}, {p.state} {p.zip}</div>

          <div className="panel" style={{ marginTop: 18 }}>
            <h3>Home Information</h3>
            <div className="row"><span>Bedrooms</span><b>{p.beds}</b></div>
            <div className="row"><span>Bathrooms</span><b>{p.baths}</b></div>
            <div className="row"><span>Size</span><b>{p.sqft.toLocaleString()} sqft</b></div>
            <div className="row"><span>Type</span><b>{p.propertyType}</b></div>
            <div className="row"><span>County</span><b>{p.county}</b></div>
          </div>
        </div>

        <div>
          <div className="panel">
            <h3>Your Financial Profile</h3>
            
            <div className="form-group">
              <label>Gross Annual Income</label>
              <div className="input-with-label">
                <span>$</span>
                <input 
                  type="number" 
                  value={profile.income} 
                  onChange={(e) => updateProfile("income", parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Liquid Savings</label>
                <div className="input-with-label">
                  <span>$</span>
                  <input 
                    type="number" 
                    value={profile.savings} 
                    onChange={(e) => updateProfile("savings", parseFloat(e.target.value) || 0)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Credit Score (FICO)</label>
                <input 
                  type="number" 
                  min="300" 
                  max="850"
                  value={profile.creditScore} 
                  onChange={(e) => updateProfile("creditScore", parseInt(e.target.value) || 0)} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Monthly Non-Housing Debt</label>
                <div className="input-with-label">
                  <span>$</span>
                  <input 
                    type="number" 
                    value={profile.monthlyDebt} 
                    onChange={(e) => updateProfile("monthlyDebt", parseFloat(e.target.value) || 0)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Household Size</label>
                <input 
                  type="number" 
                  min="1"
                  value={profile.householdSize} 
                  onChange={(e) => updateProfile("householdSize", parseInt(e.target.value) || 1)} 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Profession</label>
              <select 
                value={profile.profession} 
                onChange={(e) => updateProfile("profession", e.target.value)}
              >
                <option value="other">Other / Standard</option>
                <option value="teacher">Teacher</option>
                <option value="police">Police Officer</option>
                <option value="firefighter">Firefighter</option>
                <option value="emt">EMT / First Responder</option>
              </select>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={profile.firstTimeBuyer} 
                  onChange={(e) => updateProfile("firstTimeBuyer", e.target.checked)} 
                />
                <span className="checkbox-label">First-Time Homebuyer</span>
              </label>

              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={profile.veteran} 
                  onChange={(e) => updateProfile("veteran", e.target.checked)} 
                />
                <span className="checkbox-label">Active Duty or Veteran</span>
              </label>
            </div>
          </div>

          <EligibilityPanel property={p} profile={profile} />
          <LendersPanel property={p} profile={profile} />
        </div>
      </div>
    </>
  );
}

