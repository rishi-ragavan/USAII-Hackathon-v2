import enum
import uuid
from datetime import date, time

from sqlalchemy import Date, Enum as SAEnum, ForeignKey, Integer, String, Time
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class NodeStatus(str, enum.Enum):
    """Drives the color highlight in the UI."""

    original = "original"      # user placed it
    suggested = "suggested"    # recommender proposed a new/alternative node
    modified = "modified"      # system tweaked an existing node


class Plan(Base, UUIDMixin, TimestampMixin):
    """One day. Holds the ordered nodes plus the solved timing once computed."""

    __tablename__ = "plans"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft / computed
    computed_schedule: Mapped[dict] = mapped_column(JSONB, default=dict)

    nodes: Mapped[list["Node"]] = relationship(
        back_populates="plan",
        cascade="all, delete-orphan",
        order_by="Node.order_index",
    )


class Node(Base, UUIDMixin, TimestampMixin):
    """A single planned activity. `constraints` is the LLM's structured output
    (cuisine, calories_max, protein_min, time_offset_min, spice_level, ...),
    kept as JSONB so adding a preference never needs a migration."""

    __tablename__ = "nodes"

    plan_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("plans.id", ondelete="CASCADE"), index=True
    )
    kind: Mapped[str] = mapped_column(String(40), default="custom")  # gym/meal/commute/...
    title: Mapped[str] = mapped_column(String(200))
    place_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("places.id", ondelete="SET NULL"), nullable=True
    )
    earliest: Mapped[time | None] = mapped_column(Time, nullable=True)
    latest: Mapped[time | None] = mapped_column(Time, nullable=True)
    duration_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    constraints: Mapped[dict] = mapped_column(JSONB, default=dict)
    status: Mapped[NodeStatus] = mapped_column(
        SAEnum(NodeStatus, name="node_status"), default=NodeStatus.original
    )
    # e.g. {"order_food": true} — only acted on if the user permits the action type
    automation_flags: Mapped[dict] = mapped_column(JSONB, default=dict)
    order_index: Mapped[int] = mapped_column(Integer, default=0)

    plan: Mapped["Plan"] = relationship(back_populates="nodes")
