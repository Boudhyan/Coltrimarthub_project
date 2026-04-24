-- Add missing email column
UPDATE users SET email = CONCAT(username, '@example.com') WHERE email IS NULL;
