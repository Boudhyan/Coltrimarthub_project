from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class ServiceRequestCreate(BaseModel):
    """Create a service request row (e.g. after admin submits / allots work)."""

    service_type_key: str = Field(
        ...,
        min_length=1,
        max_length=64,
        description="Service type name or key (e.g. Ac Repair)",
    )
    allotted_to_user_id: Optional[int] = None
    status: str = Field(default="submitted", max_length=32)
    form_data: Optional[Dict[str, Any]] = None


class ServiceRequestUpdate(BaseModel):
    """Partial update; only sent fields are applied."""

    service_type_key: Optional[str] = Field(
        None,
        min_length=1,
        max_length=64,
    )
    allotted_to_user_id: Optional[int] = None
    status: Optional[str] = Field(None, max_length=32)
    form_data: Optional[Dict[str, Any]] = None


class ServiceRequestOut(BaseModel):
    id: int
    service_type_key: str
    customer_id: Optional[int] = None
    allotted_to_user_id: Optional[int] = None
    status: str
    form_data: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    observation_report_emailed_at: Optional[datetime] = None
    observation_updated_at: Optional[datetime] = Field(
        default=None,
        description="Last time observation sheet data was filled in (any page).",
    )

    class Config:
        from_attributes = True


class ServiceRequestListOut(BaseModel):
    """Row for the service-requests table (denormalized from form_data)."""

    id: int
    service_type_key: str
    status: str
    allotted_to_user_id: Optional[int] = None
    engineer_name: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    contact: Optional[str] = None
    product_summary: Optional[str] = None
    created_at: Optional[datetime] = None
    has_observation: Optional[bool] = None
    observation_report_emailed_at: Optional[datetime] = None
    observation_updated_at: Optional[datetime] = Field(
        default=None,
        description="Last time observation sheet data was filled in.",
    )
