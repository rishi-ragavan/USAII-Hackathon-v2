// In-app eligibility engine (frontend, works without the backend).
// Each program decides eligibility from the stored profile and explains why / why not.
// ponytail: curated rules for the ~major programs; the long tail links to Down Payment
// Resource. Estimates are on a representative $200K home — labeled as estimates in the UI.
const SAMPLE = 200000;
const SERVICE = ["teacher", "police", "firefighter", "emt"];
const savedVs20 = (downPct) => Math.round((0.20 - downPct) * SAMPLE);
const usd = (n) => "$" + n.toLocaleString();

const PROGRAMS = [
  {
    id: "fha", name: "FHA Loan", tag: "3.5% down",
    url: "https://www.hud.gov/buying/loans",
    eligible: (p) => (p.creditScore ?? 0) >= 580,
    benefit: () => `3.5% down instead of 20% — about ${usd(savedVs20(0.035))} less up front on a $200K home.`,
    reason: "Typically needs a 580+ credit score.",
  },
  {
    id: "va", name: "VA Loan", tag: "0% down",
    url: "https://www.va.gov/housing-assistance/home-loans/",
    eligible: (p) => p.veteran,
    benefit: () => `0% down and no PMI — could save the full ~${usd(savedVs20(0))} down payment.`,
    reason: "For veterans and active-duty military only.",
  },
  {
    id: "usda", name: "USDA Rural Development", tag: "0% down",
    url: "https://www.rd.usda.gov/programs-services/single-family-housing-programs",
    eligible: (p) => (p.income || 0) > 0 && p.income < 100000,
    benefit: () => `0% down on eligible rural/small-town homes — up to ~${usd(savedVs20(0))} saved. (Depends on the home's location.)`,
    reason: "Income is above the moderate-income limit for this program.",
  },
  {
    id: "homeready", name: "Fannie Mae HomeReady", tag: "3% down",
    url: "https://www.fanniemae.com/education/homeready-mortgage",
    eligible: (p) => (p.income || 0) < 90000 || p.firstTimeBuyer,
    benefit: () => `3% down with reduced mortgage insurance — about ${usd(savedVs20(0.03))} less up front.`,
    reason: "Aimed at lower-income or first-time buyers.",
  },
  {
    id: "dpa", name: "First-Time Buyer Down-Payment Assistance", tag: "Grants",
    url: "https://downpaymentresource.com/",
    eligible: (p) => p.firstTimeBuyer,
    benefit: () => "Grants and forgivable loans for your down payment and closing costs (varies by state/city).",
    reason: "Most of these programs require you to be a first-time buyer.",
  },
  {
    id: "mcc", name: "Mortgage Credit Certificate (MCC)", tag: "Tax credit",
    url: "https://www.hud.gov/buying/localbuying",
    eligible: (p) => p.firstTimeBuyer && (p.income || 0) < 90000,
    benefit: () => "A yearly federal tax credit worth a portion of the mortgage interest you pay — for the life of the loan.",
    reason: "Usually for first-time buyers under the income limit.",
  },
  {
    id: "gnnd", name: "Good Neighbor Next Door", tag: "50% off",
    url: "https://www.hud.gov/program_offices/housing/sfh/reo/goodn/gnndabout",
    eligible: (p) => SERVICE.includes(p.profession),
    benefit: () => "Buy an eligible home at 50% of list price.",
    reason: "For teachers, police, firefighters, and EMTs.",
  },
  {
    id: "itin", name: "ITIN Mortgage", tag: "No SSN",
    url: "https://crosscountrymortgage.com/mortgage/loans/non-qm/itin-loans/",
    eligible: (p) => p.immigrationStatus === "itin_undocumented" || p.immigrationStatus === "visa_holder",
    benefit: () => "Buy a home using an ITIN instead of an SSN — lenders can use rent and utility history as credit.",
    reason: "For buyers without a Social Security number.",
  },
];

// Always-available help (not eligibility-gated).
export const GENERAL = [
  { tag: "Start here", name: "Buying a House — CFPB",
    desc: "The U.S. government's step-by-step guide, with calculators and checklists.",
    url: "https://www.consumerfinance.gov/owning-a-home/" },
  { tag: "Free help", name: "Find a HUD-Approved Housing Counselor",
    desc: "Independent, free or low-cost expert advice near you. Or call 800-569-4287.",
    url: "https://www.consumerfinance.gov/find-a-housing-counselor/" },
  { tag: "Down payment", name: "Down Payment Resource",
    desc: "Search 2,600+ assistance programs by your location.",
    url: "https://downpaymentresource.com/" },
];

export function evaluatePrograms(profile) {
  const qualified = [], other = [];
  for (const prog of PROGRAMS) {
    if (prog.eligible(profile)) qualified.push({ ...prog, benefit: prog.benefit(profile) });
    else other.push(prog);
  }
  return { qualified, other };
}
