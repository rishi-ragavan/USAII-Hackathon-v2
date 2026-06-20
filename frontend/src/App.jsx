import { useEffect, useMemo, useState } from "react";
import { getListings } from "./api";
import PropertyDetail from "./PropertyDetail";
import ProfileDrawer from "./ProfileDrawer";

const usd = (n) => "$" + n.toLocaleString();

export default function App() {
  const [listings, setListings] = useState([]);
  const [q, setQ] = useState("");
  const [beds, setBeds] = useState("any");
  const [sort, setSort] = useState("relevant");
  const [selected, setSelected] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({
    income: 42000, householdSize: 4, savings: 3500,
    currentRent: 1200, currentUtilities: 280,
    firstTimeBuyer: true, veteran: false,
  });

  useEffect(() => { getListings().then(setListings); }, []);

  const shown = useMemo(() => {
    let r = listings.filter((p) =>
      `${p.city} ${p.state} ${p.zip} ${p.address}`.toLowerCase().includes(q.toLowerCase())
    );
    if (beds !== "any") r = r.filter((p) => p.beds >= Number(beds));
    const by = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "sqft-desc": (a, b) => b.sqft - a.sqft,
      "beds-desc": (a, b) => b.beds - a.beds,
    }[sort];
    return by ? [...r].sort(by) : r;
  }, [listings, q, beds, sort]);

  return (
    <>
      <nav className="nav">
        <div className="logo">Home<span>stead</span></div>
        <div className="tagline">Keeping the American Dream within reach</div>
        <div className="spacer" />
        <button className="btn-ghost" onClick={() => setShowProfile(true)}>Your info</button>
      </nav>

      {selected ? (
        <div className="wrap">
          <PropertyDetail property={selected} profile={profile}
            onBack={() => setSelected(null)} />
        </div>
      ) : (
        <div className="wrap">
          <div className="hero">
            <h1>Find a home you can <em>actually</em> afford.</h1>
            <p>Every listing shows the aid you qualify for and lenders built for your budget.</p>
            <div className="search">
              <input placeholder="City, ZIP, or address"
                value={q} onChange={(e) => setQ(e.target.value)} />
              <button>Search</button>
            </div>
          </div>

          <div className="toolbar">
            <span className="count"><b>{shown.length}</b> homes within reach</span>
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
                <option value="relevant">Sort: Relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="sqft-desc">Largest</option>
                <option value="beds-desc">Most bedrooms</option>
              </select>
            </div>
          </div>

          <div className="grid">
            {shown.map((p) => (
              <div key={p.id} className="card" onClick={() => setSelected(p)}>
                <div className="imgwrap">
                  <img src={p.photo} alt={p.address} />
                  <span className="tag">Aid eligible</span>
                </div>
                <div className="body">
                  <div className="price">{usd(p.price)}</div>
                  <div className="addr">{p.address}, {p.city}, {p.state}</div>
                  <div className="facts">
                    <span><b>{p.beds}</b> bd</span>
                    <span><b>{p.baths}</b> ba</span>
                    <span><b>{p.sqft.toLocaleString()}</b> sqft</span>
                  </div>
                  <span className="badge">May qualify for down-payment aid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showProfile && (
        <ProfileDrawer profile={profile} setProfile={setProfile}
          onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
