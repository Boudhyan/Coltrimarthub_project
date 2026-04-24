#!/usr/bin/env python3
"""
Seed dummy data for PDF page 2 (page_02 / STC performance form) into observation_requests.

Run from repo root:
  cd backend && python scripts/seed_dummy_observation_page02.py

Requires MySQL and service_requests / observation_requests tables (see app/database/observation_requests.sql).
"""

from __future__ import annotations

import sys
from pathlib import Path

# Add backend root for `app` imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.orm.attributes import flag_modified

from app.database.session import SessionLocal
from app.models.observation_request import ObservationRequest
from app.models.service_request import ServiceRequest

DUMMY_PAGE_02 = {
    "testMethod": "Dummy IEC 61215 — STC flash (seed)",
    "solarSimulatorUsed": True,
    "naturalSunlightUsed": False,
    "samples": [
        {
            "sampleNo": "DUMMY-SR-001",
            "isc": "8.42",
            "voc": "48.10",
            "solarImp": "7.95",
            "solarVmp": "40.20",
            "naturalPmax": "319.5",
            "naturalFf": "78.4",
            "result": "Pass (seeded)",
        }
    ],
    "supplementary": "Seeded via backend/scripts/seed_dummy_observation_page02.py — safe to edit in the app.",
}


def main() -> None:
    db = SessionLocal()
    try:
        row = db.query(ObservationRequest).order_by(ObservationRequest.id).first()
        if row is None:
            sr = ServiceRequest(
                service_type_key="mqt_06_1_ini",
                status="allotted",
            )
            db.add(sr)
            db.commit()
            db.refresh(sr)
            row = ObservationRequest(
                service_request_id=sr.id,
                observations_json={},
            )
            db.add(row)
            db.commit()
            db.refresh(row)
            print(f"Created service_request id={sr.id}, observation_requests id={row.id}")
        else:
            print(
                f"Using existing observation_requests id={row.id}, "
                f"service_request_id={row.service_request_id}"
            )

        obs = dict(row.observations_json or {})
        obs["page_02"] = DUMMY_PAGE_02
        row.observations_json = obs
        flag_modified(row, "observations_json")
        db.add(row)
        db.commit()
        print("Saved observations_json.page_02 dummy payload.")
        print(f"Open frontend: /observation/sr/{row.service_request_id}/edit?page=2")
    finally:
        db.close()


if __name__ == "__main__":
    main()
