import { HOME_TYPES } from "./homeTypes";

// ponytail: heuristic snapshot for the demo; Person 2's HUD-AMI engine replaces this.
function aidSnapshot(p) {
  const out = [];
  if (p.veteran) out.push("VA loan — 0% down payment");
  if (p.immigrationStatus === "itin_undocumented" || p.immigrationStatus === "visa_holder")
    out.push("ITIN mortgage — no SSN required");
  if (p.income > 0 && p.income < 60000) out.push("USDA / state HFA — 0–3% down");
  if (p.income > 0 && p.income < 90000) out.push("FHA loan — 3.5% down");
  if (p.firstTimeBuyer) out.push("First-time buyer down-payment assistance");
  if (["teacher", "police", "firefighter", "emt"].includes(p.profession))
    out.push("Good Neighbor Next Door — 50% off");
  if (!out.length) out.push("Enter your income to see programs you may qualify for");
  return out;
}

const num = (v) => Number(v) || 0;

export default function InfoScreen({ profile, setProfile, onDone }) {
  const set = (k) => (e) => setProfile({ ...profile, [k]: num(e.target.value) });
  const setStr = (k) => (e) => setProfile({ ...profile, [k]: e.target.value });
  const toggle = (k) => setProfile({ ...profile, [k]: !profile[k] });

  return (
    <div className="screen form-page">
      <div className="screen-head">
        <h1>Your information</h1>
        <p>The more we know, the more aid and lenders we can match — on every home.</p>
      </div>

      <div className="form-grid">
        <div>
          <label className="label">Annual household income</label>
          <input className="input" type="number" value={profile.income || ""}
            onChange={set("income")} placeholder="42000" />
        </div>
        <div>
          <label className="label">Household size</label>
          <input className="input" type="number" value={profile.householdSize || ""}
            onChange={set("householdSize")} placeholder="4" />
        </div>
        <div>
          <label className="label">Savings for down payment</label>
          <input className="input" type="number" value={profile.savings || ""}
            onChange={set("savings")} placeholder="12000" />
        </div>
        <div>
          <label className="label">Credit score (FICO)</label>
          <input className="input" type="number" value={profile.creditScore || ""}
            onChange={set("creditScore")} placeholder="680" />
        </div>
        <div>
          <label className="label">Monthly non-housing debt</label>
          <input className="input" type="number" value={profile.monthlyDebt || ""}
            onChange={set("monthlyDebt")} placeholder="250" />
        </div>
        <div>
          <label className="label">Current monthly rent</label>
          <input className="input" type="number" value={profile.currentRent || ""}
            onChange={set("currentRent")} placeholder="1200" />
        </div>
        <div>
          <label className="label">Current monthly utilities</label>
          <input className="input" type="number" value={profile.currentUtilities || ""}
            onChange={set("currentUtilities")} placeholder="280" />
        </div>
        <div>
          <label className="label">Current home size (sqft)</label>
          <input className="input" type="number" value={profile.currentSqft || ""}
            onChange={set("currentSqft")} placeholder="1100" />
        </div>
        <div>
          <label className="label">Current state</label>
          <input className="input" maxLength={2} value={profile.currentState || ""}
            onChange={(e) => setProfile({ ...profile, currentState: e.target.value.toUpperCase() })}
            placeholder="GA" />
        </div>
        <div>
          <label className="label">Profession</label>
          <select className="input" value={profile.profession ?? "other"} onChange={setStr("profession")}>
            <option value="other">Other / Standard</option>
            <option value="teacher">Teacher</option>
            <option value="police">Police Officer</option>
            <option value="firefighter">Firefighter</option>
            <option value="emt">EMT / First Responder</option>
          </select>
        </div>
        <div>
          <label className="label">Employment type</label>
          <select className="input" value={profile.employmentType ?? "w2"} onChange={setStr("employmentType")}>
            <option value="w2">Employee (W-2)</option>
            <option value="self_employed">Self-employed / 1099</option>
            <option value="business_owner">Business owner</option>
          </select>
        </div>
        <div>
          <label className="label">Immigration status</label>
          <select className="input" value={profile.immigrationStatus ?? "citizen"} onChange={setStr("immigrationStatus")}>
            <option value="citizen">U.S. citizen</option>
            <option value="permanent_resident">Permanent resident (green card)</option>
            <option value="visa_holder">Visa holder</option>
            <option value="itin_undocumented">ITIN / no SSN</option>
          </select>
        </div>
        <div>
          <label className="label">Type of home you're considering</label>
          <select className="input" value={profile.homeType ?? "single_family"} onChange={setStr("homeType")}>
            {HOME_TYPES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div className="snapshot" style={{ background: "var(--surface-2)" }}>
        <h4>Know your home type — each can change the loan or process</h4>
        {HOME_TYPES.map((t) => (
          <div key={t.id} className={"type" + (profile.homeType === t.id ? " on" : "")}>
            <b>{t.name}</b><span>{t.note}</span>
          </div>
        ))}
      </div>

      <label className="label">First-time buyer?</label>
      <div className="toggle-row">
        <button className={"chip" + (profile.firstTimeBuyer ? " on" : "")} onClick={() => toggle("firstTimeBuyer")}>Yes</button>
        <button className={"chip" + (!profile.firstTimeBuyer ? " on" : "")} onClick={() => toggle("firstTimeBuyer")}>No</button>
      </div>

      <label className="label">Veteran or active military?</label>
      <div className="toggle-row">
        <button className={"chip" + (profile.veteran ? " on" : "")} onClick={() => toggle("veteran")}>Yes</button>
        <button className={"chip" + (!profile.veteran ? " on" : "")} onClick={() => toggle("veteran")}>No</button>
      </div>

      <div className="snapshot">
        <h4>You may qualify for</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {aidSnapshot(profile).map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>

      <button className="btn-primary" onClick={onDone}>Save &amp; see matching homes</button>
    </div>
  );
}
