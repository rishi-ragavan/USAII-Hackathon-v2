from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, health, eligibility
from app.core.config import settings

app = FastAPI(title="DayGraph API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(eligibility.router)


@app.get("/", tags=["health"])
def root() -> dict:
    return {"name": "DayGraph API", "version": app.version}

