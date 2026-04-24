-- Optional: seed page_02 dummy JSON on the first observation_requests row.
-- Prefer: python scripts/seed_dummy_observation_page02.py (handles missing rows).
--
-- mysql -h127.0.0.1 -uroot -p lab_system < backend/app/database/seed_dummy_page_02.sql

UPDATE observation_requests
SET observations_json = JSON_MERGE_PATCH(
  COALESCE(observations_json, JSON_OBJECT()),
  JSON_OBJECT(
    'page_02',
    JSON_OBJECT(
      'testMethod', 'Dummy STC (SQL seed)',
      'solarSimulatorUsed', true,
      'naturalSunlightUsed', false,
      'supplementary', 'Seeded via seed_dummy_page_02.sql',
      'samples',
      JSON_ARRAY(
        JSON_OBJECT(
          'sampleNo', 'SQL-001',
          'isc', '8.0',
          'voc', '48.0',
          'solarImp', '7.9',
          'solarVmp', '40.0',
          'naturalPmax', '310',
          'naturalFf', '78',
          'result', 'OK'
        )
      )
    )
  )
)
ORDER BY id ASC
LIMIT 1;
