-- Full-access flag: bypasses RBAC (same effect as role name Admin / admin).
-- Run on existing DBs where `roles` was created before this column existed.

ALTER TABLE roles
  ADD COLUMN is_superuser TINYINT(1) NOT NULL DEFAULT 0;

UPDATE roles SET is_superuser = 1
WHERE LOWER(TRIM(name)) IN ('admin', 'administrator', 'super admin', 'superadmin', 'super-admin');
