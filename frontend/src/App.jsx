import { useEffect, useState } from "react";
import { getListings } from "./api";
import PropertyDetail from "./PropertyDetail";

const usd = (n) => "$" + n.toLocaleString();

export default function App() {
  const [listings, setListings] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => { getListings().then(setListings); }, []);

  const shown = listings.filter((p) =>
    `${p.city} ${p.state} ${p.zip} ${p.address}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <nav className="nav">
        <div className="logo">Home<span>stead</span></div>
        <div className="tagline">Keeping the American Dream within reach</div>
      </nav>

      {selected ? (
        <div className="wrap">
          <PropertyDetail property={selected} onBack={() => setSelected(null)} />
        </div>
      ) : (
        <div className="wrap">
          <div className="hero">
            <h1>Find a home you can actually afford.</h1>
            <p>Every listing shows the aid you qualify for and lenders built for your budget.</p>
            <div className="search">
              <input
                placeholder="City, ZIP, or address"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button>Search</button>
            </div>
          </div>

          <div className="grid">
            {shown.map((p) => (
              <div key={p.id} className="card" onClick={() => setSelected(p)}>
                <img src={p.photo} alt={p.address} />
                <div className="body">
                  <div className="price">{usd(p.price)}</div>
                  <div className="addr">{p.address}, {p.city}, {p.state}</div>
                  <div className="facts">
                    <span><b>{p.beds}</b> bd</span>
                    <span><b>{p.baths}</b> ba</span>
                    <span><b>{p.sqft.toLocaleString()}</b> sqft</span>
                  </div>
                  <span className="badge">May qualify for aid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
