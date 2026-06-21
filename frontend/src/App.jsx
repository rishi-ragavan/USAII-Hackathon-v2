import { useEffect, useMemo, useState } from "react";
import { getListings } from "./api";
import PropertyDetail from "./PropertyDetail";
import InfoScreen from "./InfoScreen";
import ResourcesScreen from "./ResourcesScreen";
import AboutScreen from "./AboutScreen";

const usd = (n) => "$" + n.toLocaleString();
const kfmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));

const DEFAULT_PROFILE = {
  income: 42000, householdSize: 4, savings: 12000,
  currentRent: 1200, currentUtilities: 280, currentSqft: 1100, currentState: "GA",
  creditScore: 680, monthlyDebt: 250, profession: "teacher",
  employmentType: "w2", immigrationStatus: "citizen", homeType: "single_family",
  firstTimeBuyer: true, veteran: false,
};
const loadProfile = () => {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem("homestead_profile")) }; }
  catch { return DEFAULT_PROFILE; }
};
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// Match score (58–99) — how well a home fits THIS buyer. Drives tile size + label.
function score(p, profile) {
  const monthlyIncome = (profile.income || 1) / 12;
  const payment = p.price * 0.0062;            // rough PITI ≈ 0.62%/mo of price
  const ratio = payment / monthlyIncome;       // lower = more affordable
  const afford = Math.max(0, Math.min(1, 1 - (ratio - 0.18) / 0.5));
  const bedsFit = p.beds >= Math.ceil((profile.householdSize || 1) / 2) ? 1 : 0.6;
  const aid = (profile.firstTimeBuyer ? 0.05 : 0) + (profile.veteran ? 0.05 : 0);
  const raw = afford * 0.7 + bedsFit * 0.2 + aid + 0.05;
  return Math.max(58, Math.min(99, Math.round(raw * 100)));
}

// Bigger tile = better match. Front-loads larger tiles to higher-ranked homes.
const sizeFor = (i) =>
  i === 0 ? "s-xl" : i <= 2 ? "s-wide" : i <= 4 ? "s-tall" : "s-sm";

const Heart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.2 5 5.5 5 8 5 9.3 6.7 12 9c2.7-2.3 4-4 6.5-4C21.8 5 23.5 8.4 22 11.7 19.5 16.4 12 21 12 21z"/></svg>
);
const Eye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
);

export default function App() {
  const [listings, setListings] = useState([]);
  const [q, setQ] = useState("");
  const [beds, setBeds] = useState("any");
  const [sort, setSort] = useState("match");
  const [selected, setSelected] = useState(null);
  const [screen, setScreen] = useState("home"); // home | info | resources
  const [profile, setProfile] = useState(loadProfile);

  useEffect(() => {
    localStorage.setItem("homestead_profile", JSON.stringify(profile));
  }, [profile]);

  const navTo = (s) => () => { setSelected(null); setScreen(s); };
  const goHome = navTo("home");

  useEffect(() => { getListings().then(setListings); }, []);

  const shown = useMemo(() => {
    let r = listings
      .map((p) => ({
        ...p,
        match: score(p, profile),
        likes: 40 + (hash(p.id) % 220),
        views: 900 + ((hash(p.id) * 37) % 19000),
      }))
      .filter((p) =>
        `${p.city} ${p.state} ${p.zip} ${p.address}`.toLowerCase().includes(q.toLowerCase())
      );
    if (beds !== "any") r = r.filter((p) => p.beds >= Number(beds));
    const by = {
      match: (a, b) => b.match - a.match,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "sqft-desc": (a, b) => b.sqft - a.sqft,
    }[sort];
    return by ? [...r].sort(by) : r;
  }, [listings, q, beds, sort, profile]);

  return (
    <>
      <nav className="nav">
        <button className="logo" onClick={goHome} title="Home">Home<span>stead</span></button>
        <div className="tagline">Keeping the American Dream within reach</div>
        <div className="spacer" />
        <button className="btn-link" onClick={navTo("about")}>About</button>
        <button className="btn-link" onClick={navTo("resources")}>Resources</button>
        <button className="btn-ghost" onClick={navTo("info")}>Your info</button>
      </nav>

      {selected ? (
        <div className="wrap">
          <PropertyDetail property={selected} profile={profile}
            onBack={() => setSelected(null)} />
        </div>
      ) : screen === "info" ? (
        <div className="wrap">
          <InfoScreen profile={profile} setProfile={setProfile} onDone={goHome} />
        </div>
      ) : screen === "about" ? (
        <div className="wrap"><AboutScreen /></div>
      ) : screen === "resources" ? (
        <div className="wrap">
          <ResourcesScreen profile={profile} onEdit={navTo("info")} />
        </div>
      ) : (
        <div className="wrap">
          <div className="hero">
            <h1>Find a home you can <em>actually</em> afford.</h1>
            <p>Ranked for you — the better a home fits your budget and aid, the bigger it shows.</p>
            <div className="search">
              <input placeholder="City, ZIP, or address"
                value={q} onChange={(e) => setQ(e.target.value)} />
              <button>Search</button>
            </div>
          </div>

          <div className="toolbar">
            <span className="count"><b>{shown.length}</b> homes · ranked for you</span>
            <div className="field">
              <select value={beds} onChange={(e) => setBeds(e.target.value)}>
                <option value="any">Any beds</option>
                <option value="2">2+ beds</option>
                <option value="3">3+ beds</option>
                <option value="4">4+ beds</option>
              </select>
            </div>
            <div className="field">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="match">Best match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="sqft-desc">Largest</option>
              </select>
            </div>
          </div>

          <div className="bento">
            {shown.map((p, i) => (
              <div key={p.id} className={`tile ${sort === "match" ? sizeFor(i) : "s-sm"}`}
                onClick={() => setSelected(p)}>
                <img src={p.photo} alt={p.address} />
                <div className="scrim" />
                <div className="t-top">
                  {i === 0 && sort === "match" && <span className="ribbon">Top match</span>}
                  <span className="match">{p.match}% match</span>
                </div>
                <div className="t-body">
                  <div className="t-price">{usd(p.price)}</div>
                  <div className="t-addr">{p.address}, {p.city}, {p.state}</div>
                  <div className="t-facts">{p.beds} bd · {p.baths} ba · {p.sqft.toLocaleString()} sqft</div>
                  <div className="t-meta">
                    <span className="m"><Heart /> {p.likes}</span>
                    <span className="m"><Eye /> {kfmt(p.views)}</span>
                    <span className="t-aid">Aid eligible</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
