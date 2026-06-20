// Per-state precision inputs for the monthly-cost estimate. Approximate public
// averages — good enough for an estimate, labeled as such in the UI.
//   tax     effective property tax rate /yr   (Tax Foundation / ATTOM, 2023)
//   ins     homeowner insurance /yr as % of value (NAIC-derived, storm-risk aware)
//   climate relative heating+cooling degree-days, 1.0 = US average (NOAA-derived)
const STATE = {
  AL: { tax: 0.0040, ins: 0.0075, climate: 0.85 },
  AR: { tax: 0.0062, ins: 0.0080, climate: 0.85 },
  AZ: { tax: 0.0062, ins: 0.0045, climate: 1.00 },
  CO: { tax: 0.0051, ins: 0.0075, climate: 1.05 },
  GA: { tax: 0.0090, ins: 0.0055, climate: 0.85 },
  IA: { tax: 0.0152, ins: 0.0045, climate: 1.15 },
  IN: { tax: 0.0084, ins: 0.0045, climate: 1.00 },
  KS: { tax: 0.0134, ins: 0.0080, climate: 1.00 },
  LA: { tax: 0.0056, ins: 0.0110, climate: 0.90 },
  MI: { tax: 0.0138, ins: 0.0045, climate: 1.15 },
  MO: { tax: 0.0097, ins: 0.0065, climate: 0.95 },
  MS: { tax: 0.0079, ins: 0.0090, climate: 0.85 },
  NM: { tax: 0.0078, ins: 0.0050, climate: 0.80 },
  NY: { tax: 0.0140, ins: 0.0040, climate: 1.10 },
  OH: { tax: 0.0152, ins: 0.0040, climate: 1.05 },
  OK: { tax: 0.0089, ins: 0.0110, climate: 0.95 },
  PA: { tax: 0.0149, ins: 0.0040, climate: 1.00 },
  SC: { tax: 0.0056, ins: 0.0065, climate: 0.80 },
  TN: { tax: 0.0066, ins: 0.0055, climate: 0.85 },
  TX: { tax: 0.0168, ins: 0.0090, climate: 0.95 },
  WI: { tax: 0.0161, ins: 0.0035, climate: 1.25 },
  WV: { tax: 0.0057, ins: 0.0045, climate: 0.95 },
};
const US = { tax: 0.0110, ins: 0.0035, climate: 1.0 }; // national fallback

export const getRates = (state) => STATE[(state || "").toUpperCase()] || US;
