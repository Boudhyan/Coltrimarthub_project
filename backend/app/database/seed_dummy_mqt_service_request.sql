-- Dummy MQT 06.1 ini job + empty observation row (adjust if ids already exist).
-- Run: mysql -h127.0.0.1 -uroot -pYOURPASSWORD lab_system < seed_dummy_mqt_service_request.sql

INSERT INTO service_requests (service_type_key, allotted_to_user_id, status)
VALUES ('mqt_06_1_ini', NULL, 'allotted');

INSERT INTO observation_requests (service_request_id, observations_json)
VALUES (LAST_INSERT_ID(), JSON_OBJECT());

SELECT sr.id AS open_this_service_request_id_in_browser,
       CONCAT('http://127.0.0.1:5173/observation/sr/', sr.id, '/mqt-06-1-ini') AS example_url
FROM service_requests sr
JOIN observation_requests o ON o.service_request_id = sr.id
ORDER BY sr.id DESC LIMIT 1;
