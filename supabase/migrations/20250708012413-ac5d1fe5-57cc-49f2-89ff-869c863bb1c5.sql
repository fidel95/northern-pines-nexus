-- Create a canvasser record for the authenticated user to enable testing
INSERT INTO canvassers (
  name, 
  email, 
  phone, 
  assigned_territories, 
  hire_date, 
  active,
  total_visits,
  leads_generated,
  conversion_rate
) VALUES (
  'Test Canvasser',
  'fc.fidel1995@gmail.com',
  '+1-555-123-4567',
  ARRAY['12345', '12346'],
  CURRENT_DATE,
  true,
  0,
  0,
  0.00
) ON CONFLICT (email) DO NOTHING;

-- Also create RLS policies for canvassers to access their own data
CREATE POLICY "Canvassers can view their own data" 
ON canvassers 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Canvassers can update their own data" 
ON canvassers 
FOR UPDATE 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Allow canvassers to manage their own canvassing activities
CREATE POLICY "Canvassers can manage their own activities" 
ON canvassing_activities 
FOR ALL 
USING (canvasser_id = (
  SELECT id FROM canvassers 
  WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
));