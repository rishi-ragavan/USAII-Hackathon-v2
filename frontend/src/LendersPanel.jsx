// PERSON 3 owns this. Input: property + profile (see contract.js).
// Output: render LenderResult[] from HMDA (property.censusTract) ranked vs FRED rate.
export default function LendersPanel({ property, profile }) {
  return (
    <div className="panel">
      <h3>Lenders near you</h3>
      <p className="stub">
        Person 3: query HMDA by property.censusTract for active lenders + rates,
        rank below the FRED/Freddie benchmark. Render one .row per lender.
      </p>
    </div>
  );
}
