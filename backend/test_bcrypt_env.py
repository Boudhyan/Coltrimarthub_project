from app.utils.security import hash_password, verify_password

pw = "1234"
hashed = hash_password(pw)
print("Hashed:", hashed)
print("Verify:", verify_password(pw, hashed))