from app.utils.security import hash_password, verify_password

password = "123456"
hashed_password = hash_password(password)
print("Hashed:", hashed_password)
is_valid = verify_password(password, hashed_password)
print("Verify:", is_valid)
