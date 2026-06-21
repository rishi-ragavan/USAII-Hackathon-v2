"""Affordability + program-eligibility engine (Person 2).

POST /eligibility  ->  affordability verdict + which assistance programs the buyer
qualifies for on a given property, with full monthly-cost breakdown and DTI.
Pure computation (no DB): a transparent rules engine, not a black box.
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["eligibility"])

# National-average constants (defensible; documented for judges).
TERM = 360                # 30-yr fixed, months
TAX_RATE = 0.011          # property tax /yr
INS_RATE = 0.0035         # homeowner insurance /yr
DTI_OK, DTI_MAX = 0.36, 0.45   # back-end DTI: <=.36 comfortable, >.45 disqualifies
SERVICE = {"teacher", "police", "firefighter", "emt"}


class UserIn(BaseModel):
    income: float
    credit_score: int = 680
    savings: float = 0
    monthly_debt: float = 0
    family_size: int = 1
    is_veteran: bool = False
    is_first_time_buyer: bool = False
    profession: str = "other"


class PropertyIn(BaseModel):
    price: float
    zip_code: str = ""
    county: str = ""
    state: str = ""
    is_rural: bool = False
    is_hud_owned: bool = False


class EligibilityRequest(BaseModel):
    user: UserIn
    property: PropertyIn


def _pi(loan: float, annual_rate: float) -> float:
    """Monthly principal + interest."""
    r = annual_rate / 100 / 12
    return loan * r / (1 - (1 + r) ** -TERM) if loan > 0 and r > 0 else loan / TERM


# Each program: rate %, down-payment fraction, annual mortgage-insurance rate on the
# loan, and an eligibility check returning None (ok) or a human reason string.
def _programs(u: UserIn, p: PropertyIn):
    return [
        ("va", "VA Loan", 6.25, 0.0, 0.0,
         None if u.is_veteran else "Available to veterans and active-duty military."),
        ("usda", "USDA Rural Development", 6.5, 0.0, 0.0035,
         None if p.is_rural and u.income < 110000 else
         ("Home must be in a USDA-eligible rural area." if not p.is_rural
          else "Income is above the USDA limit.")),
        ("fha", "FHA Loan", 6.5, 0.035, 0.0085,
         None if u.credit_score >= 580 else "Requires a 580+ credit score."),
        ("homeready", "Fannie Mae HomeReady", 6.75, 0.03, 0.005,
         None if u.credit_score >= 620 and (u.income < 90000 or u.is_first_time_buyer)
         else ("Requires a 620+ credit score." if u.credit_score < 620
               else "Income above the HomeReady limit.")),
        ("conv20", "Conventional (20% down)", 6.4, 0.20, 0.0,
         None if u.credit_score >= 620 else "Requires a 620+ credit score."),
        ("gnnd", "Good Neighbor Next Door", 6.5, 0.035, 0.0085,
         None if (u.profession in SERVICE and p.is_hud_owned) else
         ("For an eligible HUD-listed home." if u.profession in SERVICE
          else "For teachers, police, firefighters, and EMTs.")),
    ]


@router.post("/eligibility")
def eligibility(req: EligibilityRequest) -> dict:
    u, p = req.user, req.property
    monthly_income = max(u.income, 1) / 12
    max_payment = round(0.28 * monthly_income)

    qualified, unqualified = [], []
    for pid, name, rate, down_frac, mi_rate, reason in _programs(u, p):
        price = p.price * 0.5 if pid == "gnnd" else p.price   # GNND = 50% off
        down = round(price * down_frac)
        loan = max(price - down, 0)
        pi = _pi(loan, rate)
        pmi = loan * mi_rate / 12
        tax = price * TAX_RATE / 12
        ins = price * INS_RATE / 12
        total = pi + pmi + tax + ins
        dti = (total + u.monthly_debt) / monthly_income

        if reason is None and u.savings < down:
            reason = f"Needs ${down:,.0f} down; you have ${u.savings:,.0f} saved."
        if reason is None and dti > DTI_MAX:
            reason = "Monthly payment would push your debt-to-income too high."

        if reason:
            unqualified.append({"program_id": pid, "name": name, "reason": reason})
        else:
            qualified.append({
                "program_id": pid, "name": name, "interest_rate": rate,
                "required_down_payment": down,
                "monthly_p_and_i": round(pi), "monthly_pmi": round(pmi),
                "monthly_tax": round(tax), "monthly_insurance": round(ins),
                "monthly_total": round(total), "dti_ratio": round(dti, 4),
            })

    qualified.sort(key=lambda x: x["monthly_total"])
    best_dti = qualified[0]["dti_ratio"] if qualified else \
        (_pi(p.price * 0.965, 6.75) + p.price * (TAX_RATE + INS_RATE) / 12
         + u.monthly_debt) / monthly_income
    status = ("AFFORDABLE" if best_dti <= DTI_OK
              else "STRETCHED" if best_dti <= 0.43 else "OVERBURDENED")

    return {
        "is_affordable": status,
        "max_affordable_monthly_payment": max_payment,
        "qualified_programs": qualified,
        "unqualified_programs": unqualified,
    }
