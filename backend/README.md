# DayGraph — backend

FastAPI + PostgreSQL (PostGIS + pgvector) + Redis. Modular monolith.

Node-based day planner: users place activity **nodes** on a canvas; the backend
parses free-text into structured constraints (LLM), solves a timed plan
(scheduler), and learns preferences over time (recommender). Automation and
location tracking are gated behind explicit user permission.

## Layout

```
app/
  core/      config, db session, stub JWT security
  models/    SQLAlchemy ORM (the shared data model)
  schemas/   Pydantic request/response contracts
  api/       routers (health, auth, ... )
  services/  parser / scheduler / maps / recommender / automation  (coming next)
alembic/     migrations
db/          Postgres image (PostGIS + pgvector) + init SQL
tests/
```

## Run (Docker Compose)

```bash
cp .env.example .env
docker compose up --build        # starts db, redis, api (with --reload)

# in another shell, create the schema:
docker compose exec api alembic revision --autogenerate -m "initial schema"
docker compose exec api alembic upgrade head
```

API at http://localhost:8000 — interactive docs at http://localhost:8000/docs

## Run (without Docker)

Needs a local Postgres with the `postgis` and `vector` extensions.

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# point DATABASE_URL at localhost (see .env.example note), then:
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
uvicorn app.main:app --reload
```

## Smoke test the auth stub

```bash
# mint a token (creates the user on first call)
curl -s -X POST localhost:8000/auth/dev-login \
  -H 'content-type: application/json' \
  -d '{"email":"me@example.com"}'

# use it
curl -s localhost:8000/auth/me -H "authorization: Bearer <token>"
```

## Tests

```bash
pip install pytest
pytest
```

## Build order

1. ✅ Skeleton + data model + stub auth + health
2. Places / Nodes / Plans CRUD (Pydantic contracts)
3. `/parse-node` — LLM free-text → constraints
4. `/plans/{id}/compute` — Maps travel times + OR-Tools scheduler
5. Permissions + mock automation, then behavior logging + recommender
