from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import relationship

from app.database.base import Base


class ServiceRequest(Base):
    """
    Admin/customer service request. service_type_key identifies which of the
    ~15 observation templates applies (e.g. mqt_06_1_ini for this PDF).
    When allotted, create a linked ObservationRequest row.
    """

    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    service_type_key = Column(String(64), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("companies.id"), nullable=True, index=True)
    allotted_to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(32), nullable=False, server_default="draft")
    # Optional JSON payload for the service request form (customer, product, etc.)
    form_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    observation_report_emailed_at = Column(DateTime, nullable=True)

    observation = relationship(
        "ObservationRequest",
        back_populates="service_request",
        uselist=False,
    )
    customer = relationship("Company", uselist=False)
