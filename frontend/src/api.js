import mock from "./data/listings.json";

// Demo runs off curated $150–300K aid-qualifying homes (reliable, on-message).
// To pull LIVE SimplyRETS listings instead, set BOTH in frontend/.env:
//   VITE_USE_LIVE=1
//   VITE_SIMPLYRETS_KEY=simplyrets:simplyrets   (public demo creds, user:pass)

export async function getListings() {
  const live = import.meta.env.VITE_USE_LIVE === "1";
  const key = import.meta.env.VITE_SIMPLYRETS_KEY;
  if (!live || !key) return mock;
  try {
    const res = await fetch("https://api.simplyrets.com/properties?limit=20", {
      headers: { Authorization: "Basic " + btoa(key) },
    });
    return (await res.json()).map(normalize);
  } catch {
    return mock; // never break the demo
  }
}

function normalize(p) {
  return {
    id: String(p.mlsId),
    address: p.address?.streetName ?? "",
    city: p.address?.city ?? "",
    state: p.address?.state ?? "",
    zip: p.address?.postalCode ?? "",
    county: p.geo?.county ?? "",
    fips: "", censusTract: "",
    lat: p.geo?.lat ?? 0, lng: p.geo?.lng ?? 0,
    price: p.listPrice ?? 0,
    beds: p.property?.bedrooms ?? 0,
    baths: p.property?.bathsFull ?? 0,
    sqft: p.property?.area ?? 0,
    propertyType: p.property?.type ?? "",
    photo: p.photos?.[0] ?? "",
  };
}
