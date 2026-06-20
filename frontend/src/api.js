import mock from "./data/listings.json";

// Demo runs off curated low-income-qualifying homes (reliable, on-message).
// Set VITE_SIMPLYRETS_KEY in frontend/.env to pull live listings instead.
// Public demo creds are simplyrets:simplyrets (no real key needed to try it).

export async function getListings() {
  const key = import.meta.env.VITE_SIMPLYRETS_KEY;
  if (!key) return mock;
  try {
    const res = await fetch("https://api.simplyrets.com/properties?limit=20", {
      headers: { Authorization: "Basic " + btoa(key) }, // key = "user:pass"
    });
    const live = await res.json();
    return live.map(normalize);
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
    fips: "", censusTract: "",            // live feed lacks these; geocode if needed
    lat: p.geo?.lat ?? 0, lng: p.geo?.lng ?? 0,
    price: p.listPrice ?? 0,
    beds: p.property?.bedrooms ?? 0,
    baths: p.property?.bathsFull ?? 0,
    sqft: p.property?.area ?? 0,
    propertyType: p.property?.type ?? "",
    photo: p.photos?.[0] ?? "",
  };
}
