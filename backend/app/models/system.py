import uuid
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class AutomationPermission(Base, UUIDMixin, TimestampMixin):
    """Mandatory allow/disallow gate. No external action runs without an
    allowed row for its action_type."""

    __tablename__ = "automation_permissions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    action_type: Mapped[str] = mapped_column(String(60))  # order_food / book_transit / ...
    allowed: Mapped[bool] = mapped_column(Boolean, default=False)


class LocationConsent(Base, UUIDMixin, TimestampMixin):
    """Mandatory record of explicit consent to track location."""

    __tablename__ = "location_consents"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    granted: Mapped[bool] = mapped_column(Boolean, default=False)
    granted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    scope: Mapped[str] = mapped_column(String(60), default="foreground")


class BehaviorEvent(Base, UUIDMixin):
    """Append-only log of how the user reacts to nodes. Feeds the recommender."""

    __tablename__ = "behavior_events"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("nodes.id", ondelete="SET NULL"), nullable=True
    )
    action: Mapped[str] = mapped_column(String(40))  # accepted / edited / rejected
    payload: Mapped[dict] = mapped_column(JSONB, default=dict)
    ts: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )


class ItemEmbedding(Base, UUIDMixin):
    """Vector for 'similar item / better option' retrieval (pgvector)."""

    __tablename__ = "item_embeddings"

    entity_type: Mapped[str] = mapped_column(String(40), index=True)  # restaurant_item / route / ...
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True)
    embedding = mapped_column(Vector(1536), nullable=True)


class ExternalOrder(Base, UUIDMixin, TimestampMixin):
    """A third-party action (e.g. DoorDash). Mocked until partner access lands."""

    __tablename__ = "external_orders"

    node_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("nodes.id", ondelete="SET NULL"), nullable=True
    )
    provider: Mapped[str] = mapped_column(String(40), default="doordash")
    status: Mapped[str] = mapped_column(String(30), default="pending")
    mock: Mapped[bool] = mapped_column(Boolean, default=True)
