-- Optional: grant every row in `permissions` to the Admin role (by name).
-- Run after `permissions` and `roles` are populated so RBAC works without a special-case bypass.
-- Safe to re-run (skips existing role_permission pairs).

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE LOWER(TRIM(r.name)) IN ('admin', 'administrator')
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );
