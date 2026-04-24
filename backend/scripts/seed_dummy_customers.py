from app.database.session import SessionLocal
from app.models.company import Company


DUMMY_CUSTOMERS = [
    {
        "name": "Sunrise Power Systems",
        "address": "Plot 14, Industrial Area, Bengaluru",
        "phone": "+91-9988776611",
        "email": "qa@sunrisepower.in",
    },
    {
        "name": "GreenVolt Technologies",
        "address": "Sector 22, Noida, Uttar Pradesh",
        "phone": "+91-9810012345",
        "email": "contact@greenvolt.in",
    },
    {
        "name": "Radiant Lighting Works",
        "address": "MIDC Phase 2, Pune, Maharashtra",
        "phone": "+91-9922334455",
        "email": "support@radiantlight.in",
    },
    {
        "name": "Electra Home Appliances",
        "address": "Anna Salai, Chennai, Tamil Nadu",
        "phone": "+91-9876543210",
        "email": "service@electrahome.in",
    },
    {
        "name": "Nova Circuit Labs",
        "address": "Lal Kothi, Jaipur, Rajasthan",
        "phone": "+91-9797979797",
        "email": "info@novacircuit.in",
    },
]


def run() -> None:
    db = SessionLocal()
    try:
        inserted = 0
        updated = 0
        for item in DUMMY_CUSTOMERS:
            row = db.query(Company).filter(Company.name == item["name"]).first()
            if row:
                row.address = item["address"]
                row.phone = item["phone"]
                row.email = item["email"]
                db.add(row)
                updated += 1
            else:
                db.add(Company(**item))
                inserted += 1
        db.commit()
        print(f"Dummy customers seed complete: inserted={inserted}, updated={updated}")
    finally:
        db.close()


if __name__ == "__main__":
    run()

