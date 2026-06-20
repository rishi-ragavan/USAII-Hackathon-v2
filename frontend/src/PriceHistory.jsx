// Synthetic but deterministic price history (no listing feed exposes real history
// for these homes). Trends up to the current price so the chart reads like Zillow's.
function series(price, id) {
  const seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const years = 9;
  const start = price * 0.62; // ~9yr appreciation
  const pts = [];
  for (let i = 0; i < years; i++) {
    const t = i / (years - 1);
    const wobble = Math.sin(seed + i * 1.7) * price * 0.018;
    pts.push(Math.round(start + (price - start) * t + wobble));
  }
  pts[years - 1] = price;
  return pts;
}

export default function PriceHistory({ property: p }) {
  const data = series(p.price, p.id);
  const min = Math.min(...data), max = Math.max(...data);
  const W = 100, H = 100, pad = 4;
  const x = (i) => (i / (data.length - 1)) * W;
  const y = (v) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const pct = Math.round(((data[data.length - 1] - data[0]) / data[0]) * 100);
  const thisYear = new Date().getFullYear();

  return (
    <div className="panel chart">
      <h3>Price history</h3>
      <div className="head">
        <span className="pct up">▲ {pct}%</span>
        <span className="stub">est. value over {data.length} years</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5ce39a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5ce39a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#fill)" />
        <path d={line} fill="none" stroke="#5ce39a" strokeWidth="1.6"
          vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="axis">
        <span>{thisYear - data.length + 1}</span>
        <span>{thisYear}</span>
      </div>
    </div>
  );
}
