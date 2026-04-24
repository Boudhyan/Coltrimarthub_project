-- Run once on existing MySQL databases where `roles` was created before `is_active`
-- existed (SQLAlchemy create_all does not ALTER existing tables). Skip the ALTER if
-- the column already exists.

ALTER TABLE roles
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;

UPDATE roles SET is_active = 1 WHERE is_active IS NULL;

-- Then run seed_admin_role_permissions.sql so the Admin role keeps full access via role_permissions.
