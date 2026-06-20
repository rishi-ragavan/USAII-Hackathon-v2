// PERSON 2 owns this. Input: property + profile (see contract.js).
// Output: render EligibilityResult[] from HUD income limits + USDA + curated programs.
export default function EligibilityPanel({ property, profile }) {
  return (
    <div className="panel">
      <h3>Aid you qualify for</h3>
      <p className="stub">
        Person 2: compute programs here using property.fips (HUD AMI),
        property.lat/lng (USDA), and profile income/size. Render one .row per program.
      </p>
    </div>
  );
}
