import re
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


PAGE_KEY_MQT_06_1_INI = "mqt_06_1_ini"
PAGE_KEY_MQT_19_1 = "mqt_19_1"

LEGACY_OBSERVATION_PAGE_KEYS = frozenset(
    {PAGE_KEY_MQT_06_1_INI, PAGE_KEY_MQT_19_1}
)

# PDF observation sheet pages 1–54 → page_01 … page_54
_OBS_PAGE_RE = re.compile(r"^page_(0[1-9]|[1-4][0-9]|5[0-4])$")
# Service-specific observation keys (one sheet bundle per service profile).
_OBS_SERVICE_PAGE_RE = re.compile(r"^svc_(10322|15885|16102|16103)_[0-9]{2}$")


def is_allowed_observation_page_key(page_key: str) -> bool:
    if page_key in LEGACY_OBSERVATION_PAGE_KEYS:
        return True
    return bool(_OBS_PAGE_RE.fullmatch(page_key) or _OBS_SERVICE_PAGE_RE.fullmatch(page_key))


class ObservationPagePatch(BaseModel):
    """Arbitrary JSON for one observation page (validated loosely)."""

    data: dict[str, Any] = Field(default_factory=dict)


class ObservationRequestCreate(BaseModel):
    """Attach observation storage to an existing service request (one row per SR)."""

    service_request_id: int = Field(..., ge=1)


class ObservationRequestOut(BaseModel):
    id: int
    service_request_id: int
    observations_json: Optional[dict[str, Any]] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ObservationFullReplace(BaseModel):
    """Replace entire observations_json (merge unknown keys on client before sending)."""

    observations_json: dict[str, Any] = Field(default_factory=dict)
