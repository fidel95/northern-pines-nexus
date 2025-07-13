-- Create a canvasser record for the test user fc.fidel1995@gmail.com
INSERT INTO canvassers (
  name, 
  email, 
  phone, 
  assigned_territories, 
  hire_date, 
  active
) VALUES (
  'Test Canvasser',
  'fc.fidel1995@gmail.com',
  '+1234567890',
  ARRAY['12345', '12346'],
  CURRENT_DATE,
  true
) ON CONFLICT (email) DO UPDATE SET
  active = true,
  updated_at = now();