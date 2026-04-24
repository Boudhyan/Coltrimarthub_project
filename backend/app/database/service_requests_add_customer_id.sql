-- Add customer link to service requests.
-- Run:
-- mysql -h127.0.0.1 -uUSER -p DBNAME < backend/app/database/service_requests_add_customer_id.sql

ALTER TABLE service_requests
  ADD COLUMN customer_id INT NULL,
  ADD INDEX ix_service_requests_customer_id (customer_id),
  ADD CONSTRAINT fk_service_requests_customer_id
    FOREIGN KEY (customer_id) REFERENCES companies(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

