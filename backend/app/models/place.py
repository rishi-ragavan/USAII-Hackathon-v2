import uuid

from geoalchemy2 import Geography
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class Place(Base, UUIDMixin, TimestampMixin):
    """A saved location (home / work / gym / restaurant / custom). The PostGIS
    point lets the scheduler reason about 'is this on the way' and travel time."""

    __tablename__ = "places"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    label: Mapped[str] = mapped_column(String(120))
    kind: Mapped[str] = mapped_column(String(40), default="custom")
    geom = mapped_column(
        Geography(geometry_type="POINT", srid=4326), nullable=True
    )
    address: Mapped[str | None] = mapped_column(String(400), nullable=True)
    # e.g. {"google_place_id": "...", "doordash_store_id": "..."}
    external_ids: Mapped[dict] = mapped_column(JSONB, default=dict)
