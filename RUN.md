# Running Homestead

Two parts: the **frontend** (React/Vite) and the **backend** (FastAPI, powers the
Affordability + program-eligibility panel).

## Frontend
```bash
cd frontend
npm install        # first time only
npm run dev        # http://localhost:5173
```
The home grid, Resources, and Your Info work with no backend. To pull live MLS
listings instead of the curated demo homes, set in `frontend/.env`:
```
VITE_USE_LIVE=1
VITE_SIMPLYRETS_KEY=simplyrets:simplyrets
```

## Backend (for the per-home Affordability panel)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # first time only
pip install fastapi "uvicorn[standard]" pydantic pydantic-settings   # first time only
uvicorn app.main:app --port 8000                    # http://localhost:8000
```
Open a property → the **Affordability Analysis** panel calls `localhost:8000`.
If the backend is down it shows "Could not connect to backend server" (the rest of
the app still works).

## Quick check
```bash
curl -s localhost:8000/health          # {"status":"ok"} — needs the DB; eligibility does not
curl -s -X POST localhost:8000/eligibility -H 'content-type: application/json' \
  -d '{"user":{"income":42000,"savings":12000,"credit_score":680},"property":{"price":165000,"is_rural":true}}'
```
