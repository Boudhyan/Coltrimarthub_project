-- Add service_request_update for existing databases (safe to re-run).
INSERT IGNORE INTO permissions (code, module, action) VALUES
('service_request_update', 'service_request', 'update');

-- Grant new permission to Admin roles (same pattern as seed_admin_role_permissions.sql).
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE p.code = 'service_request_update'
  AND LOWER(TRIM(r.name)) IN ('admin', 'administrator')
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );
