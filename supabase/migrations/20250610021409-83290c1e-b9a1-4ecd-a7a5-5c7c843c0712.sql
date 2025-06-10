
-- Create the initial admin user (this will be done manually in Supabase Auth)
-- We'll add the admin record to link to the auth user

-- First, let's add a constraint to ensure only admins can create other admins
-- and remove any policies that allow public signup

-- Update RLS policies to be more restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create more restrictive policies for profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin(auth.uid()));

-- Add a sample admin record (you'll need to create the auth user manually)
-- This is a placeholder - you'll need to replace the UUID with the actual auth user ID
-- INSERT INTO public.admins (user_id, username) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin');

-- Add a function to create admin users programmatically
CREATE OR REPLACE FUNCTION public.create_admin_user(admin_email TEXT, admin_password TEXT, admin_username TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Only existing admins can create new admin users
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can create admin users';
  END IF;
  
  -- This function will be called from the application layer
  -- The actual user creation will be handled in the frontend
  RETURN gen_random_uuid();
END;
$$;
