-- Tracks when the observation PDF was last emailed to the customer (admin workflow).
ALTER TABLE service_requests
ADD COLUMN observation_report_emailed_at DATETIME NULL;
