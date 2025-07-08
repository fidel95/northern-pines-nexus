-- Create a test canvasser auth user
-- This will allow testing the canvasser login flow
-- Note: This is for testing purposes only. In production, canvassers should be created through proper signup flow.

-- First, let's create a function to create a canvasser auth user
CREATE OR REPLACE FUNCTION create_canvasser_test_user(
  user_email text,
  user_password text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- This is a helper function for testing
  -- In production, use proper signup flow
  RETURN 'Use Supabase Auth API to create user with email: ' || user_email;
END;
$$;