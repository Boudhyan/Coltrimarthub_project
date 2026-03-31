from passlib.context import CryptContext

# Initialize bcrypt context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Example password
password = "mypassword123"

# Hash the password (bcrypt truncates at 72 bytes)
hashed_password = pwd_context.hash(password[:72])

print("Plain password:", password)
print("Hashed password:", hashed_password)

# Verify it
is_valid = pwd_context.verify(password[:72], hashed_password)
print("Password verification result:", is_valid)