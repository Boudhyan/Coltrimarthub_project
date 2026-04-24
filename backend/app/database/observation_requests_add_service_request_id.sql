-- Use this if you already have observation_requests WITHOUT service_request_id.
-- 1) Create service_requests (see observation_requests.sql first 15 lines).
-- 2) Backfill: for each old observation row, insert a service_requests row and set service_request_id.
-- 3) Then run the statements below (adjust if your table differs).

ALTER TABLE observation_requests
  ADD COLUMN service_request_id INT NULL AFTER id;

-- After backfilling service_request_id for every row:
-- ALTER TABLE observation_requests MODIFY service_request_id INT NOT NULL;
-- ALTER TABLE observation_requests ADD UNIQUE KEY uk_observation_service_request (service_request_id);
-- ALTER TABLE observation_requests ADD CONSTRAINT fk_observation_service_request
--   FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE;
