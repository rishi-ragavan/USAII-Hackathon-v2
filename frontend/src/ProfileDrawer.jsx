// ponytail: heuristic snapshot for the demo; Person 2's HUD-AMI engine replaces this.
function aidSnapshot(p) {
  const out = [];
  if (p.veteran) out.push("VA loan — 0% down payment");
  if (p.income > 0 && p.income < 60000) out.push("USDA / state HFA — 0–3% down");
  if (p.income > 0 && p.income < 90000) out.push("FHA loan — 3.5% down");
  if (p.firstTimeBuyer) out.push("First-time buyer down-payment assistance");
  if (!out.length) out.push("Enter your income to see programs you may qualify for");
  return out;
}

const num = (v) => Number(v) || 0;

export default function ProfileDrawer({ profile, setProfile, onClose }) {
  const set = (k) => (e) => setProfile({ ...profile, [k]: num(e.target.value) });
  const toggle = (k) => setProfile({ ...profile, [k]: !profile[k] });

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer">
        <h2>Your information</h2>
        <p className="sub">We use this to show the aid and loans you qualify for — on every home.</p>

        <label className="label">Annual household income</label>
        <input className="input" type="number" value={profile.income || ""}
          onChange={set("income")} placeholder="42000" />

        <label className="label">Household size</label>
        <input className="input" type="number" value={profile.householdSize || ""}
          onChange={set("householdSize")} placeholder="4" />

        <label className="label">Savings for down payment</label>
        <input className="input" type="number" value={profile.savings || ""}
          onChange={set("savings")} placeholder="3500" />

        <label className="label">Current monthly rent</label>
        <input className="input" type="number" value={profile.currentRent || ""}
          onChange={set("currentRent")} placeholder="1200" />

        <label className="label">Current monthly utilities</label>
        <input className="input" type="number" value={profile.currentUtilities || ""}
          onChange={set("currentUtilities")} placeholder="280" />

        <label className="label">First-time buyer?</label>
        <div className="toggle-row">
          <button className={"chip" + (profile.firstTimeBuyer ? " on" : "")}
            onClick={() => toggle("firstTimeBuyer")}>Yes</button>
          <button className={"chip" + (!profile.firstTimeBuyer ? " on" : "")}
            onClick={() => toggle("firstTimeBuyer")}>No</button>
        </div>

        <label className="label">Veteran or active military?</label>
        <div className="toggle-row">
          <button className={"chip" + (profile.veteran ? " on" : "")}
            onClick={() => toggle("veteran")}>Yes</button>
          <button className={"chip" + (!profile.veteran ? " on" : "")}
            onClick={() => toggle("veteran")}>No</button>
        </div>

        <div className="snapshot">
          <h4>You may qualify for</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {aidSnapshot(profile).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>

        <button className="done" onClick={onClose}>Save & see matching homes</button>
      </aside>
    </>
  );
}
