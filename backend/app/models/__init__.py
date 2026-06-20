"""Importing every model here ensures Alembic autogenerate sees the full metadata."""

from app.models.base import Base
from app.models.place import Place
from app.models.planning import Node, NodeStatus, Plan
from app.models.system import (
    AutomationPermission,
    BehaviorEvent,
    ExternalOrder,
    ItemEmbedding,
    LocationConsent,
)
from app.models.user import Profile, User

__all__ = [
    "Base",
    "User",
    "Profile",
    "Place",
    "Plan",
    "Node",
    "NodeStatus",
    "AutomationPermission",
    "LocationConsent",
    "BehaviorEvent",
    "ItemEmbedding",
    "ExternalOrder",
]
