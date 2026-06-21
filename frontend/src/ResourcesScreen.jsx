import { evaluatePrograms, GENERAL } from "./programs";
import { leave } from "./linkout";

export default function ResourcesScreen({ profile, onEdit }) {
  const { qualified, other } = evaluatePrograms(profile);
  return (
    <div className="screen">
      <div className="screen-head">
        <h1>Aid &amp; programs for you</h1>
        <p>Computed from your profile — no forms to dig through.
          <button className="link-btn" onClick={onEdit}>Update your info</button>
        </p>
      </div>

      <h3 className="res-section">✅ You likely qualify for ({qualified.length})</h3>
      <div className="res-grid">
        {qualified.map((r) => (
          <div key={r.id} className="res-card q">
            <div className="res-tag">{r.tag}</div>
            <h4>{r.name}</h4>
            <p>{r.benefit}</p>
            <a className="res-link" href={r.url} onClick={leave(r.url)}>Apply / learn more ↗</a>
          </div>
        ))}
        {qualified.length === 0 && <p className="stub">Add your income and details to see programs.</p>}
      </div>

      {other.length > 0 && (
        <>
          <h3 className="res-section">Other programs we checked</h3>
          <div className="res-grid">
            {other.map((r) => (
              <div key={r.id} className="res-card no">
                <div className="res-tag">{r.tag}</div>
                <h4>{r.name}</h4>
                <p>{r.reason}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="res-section">Available to everyone</h3>
      <div className="res-grid">
        {GENERAL.map((r) => (
          <div key={r.name} className="res-card">
            <div className="res-tag">{r.tag}</div>
            <h4>{r.name}</h4>
            <p>{r.desc}</p>
            <a className="res-link" href={r.url} onClick={leave(r.url)}>Open ↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}
