-- Run against your lab DB if tables already exist (create_all does not add columns to existing tables).
-- mysql -h127.0.0.1 -uUSER -p DBNAME < backend/app/database/service_types_and_form_data.sql

CREATE TABLE IF NOT EXISTS service_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM service_types;

INSERT IGNORE INTO service_types (name) VALUES
('Service 14286 - 54 Page Observation'),
('Service 10322'),
('Service 15885'),
('Service 16102'),
('Service 16103');

-- MySQL 5.7+ JSON type
ALTER TABLE service_requests ADD COLUMN form_data JSON NULL;
