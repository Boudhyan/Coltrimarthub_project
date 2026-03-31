from app.database.session import SessionLocal
from app.models.user import User
from app.utils.security import hash_password

# Step 1: Open a database session
db = SessionLocal()

# Step 2: Define the new admin user
username = "admin2"          # your new username
password = "1234" # your password
hashed_password =hash_password(password)

new_admin = User(
    username=username,
    password_hash=hashed_password,
    role_id=1,           # assuming role_id=1 is admin
    is_active=True
)

# Step 3: Add to DB
db.add(new_admin)
db.commit()
db.close()

print(f"Admin '{username}' created successfully!")