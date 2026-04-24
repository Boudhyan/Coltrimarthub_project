-- Service / service-request / observation RBAC codes. Requires UNIQUE(code) on permissions.
INSERT IGNORE INTO permissions (code, module, action) VALUES
('service_type_read', 'service_type', 'read'),
('service_type_create', 'service_type', 'create'),
('service_type_update', 'service_type', 'update'),
('service_type_delete', 'service_type', 'delete'),
('service_request_read', 'service_request', 'read'),
('service_request_create', 'service_request', 'create'),
('service_request_update', 'service_request', 'update'),
('observation_read', 'observation', 'read'),
('observation_update', 'observation', 'update');
