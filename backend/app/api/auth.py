from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import create_access_token, get_current_user
from app.models.user import Profile, User

router = APIRouter(prefix="/auth", tags=["auth"])


class DevLoginIn(BaseModel):
    email: EmailStr


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeOut(BaseModel):
    id: str
    email: str


@router.post("/dev-login", response_model=TokenOut)
def dev_login(body: DevLoginIn, db: Session = Depends(get_db)) -> TokenOut:
    """Stub auth: get (or lazily create) a user by email and mint a JWT.
    Swap for Clerk / Auth0 / Sign in with Apple later."""
    user = db.scalar(select(User).where(User.email == body.email))
    if user is None:
        user = User(email=body.email, profile=Profile())
        db.add(user)
        db.commit()
        db.refresh(user)
    return TokenOut(access_token=create_access_token(str(user.id)))


@router.get("/me", response_model=MeOut)
def me(current: User = Depends(get_current_user)) -> MeOut:
    return MeOut(id=str(current.id), email=current.email)
