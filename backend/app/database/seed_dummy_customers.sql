-- Seed demo customers for /customers page.
-- Run:
-- mysql -h127.0.0.1 -uUSER -p DBNAME < backend/app/database/seed_dummy_customers.sql

INSERT INTO companies (name, address, phone, email) VALUES
('Sunrise Power Systems', 'Plot 14, Industrial Area, Bengaluru', '+91-9988776611', 'qa@sunrisepower.in'),
('GreenVolt Technologies', 'Sector 22, Noida, Uttar Pradesh', '+91-9810012345', 'contact@greenvolt.in'),
('Radiant Lighting Works', 'MIDC Phase 2, Pune, Maharashtra', '+91-9922334455', 'support@radiantlight.in'),
('Electra Home Appliances', 'Anna Salai, Chennai, Tamil Nadu', '+91-9876543210', 'service@electrahome.in'),
('Nova Circuit Labs', 'Lal Kothi, Jaipur, Rajasthan', '+91-9797979797', 'info@novacircuit.in')
ON DUPLICATE KEY UPDATE
  address = VALUES(address),
  phone = VALUES(phone),
  email = VALUES(email);

