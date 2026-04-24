from sqlalchemy import Column, ForeignKey, Integer, JSON, DateTime, func
from sqlalchemy.orm import relationship

from app.database.base import Base


class ObservationRequest(Base):
    """
    Engineer observation data for one service request (1:1 via service_request_id).

    observations_json holds every sheet the engineer saves (keys like page_01, page_02, …);
    each PATCH merges that page into this document so the full observation is persisted
    for admin review.
    """

    __tablename__ = "observation_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    service_request_id = Column(
        Integer,
        ForeignKey("service_requests.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    observations_json = Column(JSON, nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    service_request = relationship(
        "ServiceRequest", back_populates="observation"
    )
