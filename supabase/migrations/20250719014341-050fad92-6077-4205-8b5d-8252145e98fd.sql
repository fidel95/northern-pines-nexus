
-- Remove fc.fidel1995@gmail.com from canvassers table to eliminate dual role conflict
DELETE FROM canvassers WHERE email = 'fc.fidel1995@gmail.com';

-- Fix database function security issues by updating search path
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = $1
  );
$$;

-- Update RLS policies to ensure proper admin operations
DROP POLICY IF EXISTS "Admins can manage canvassers" ON canvassers;
CREATE POLICY "Admins can manage canvassers" 
ON canvassers 
FOR ALL 
USING (is_admin(auth.uid()));

-- Ensure admins can perform all operations on leads for canvasser management
DROP POLICY IF EXISTS "Admins can manage leads" ON leads;
CREATE POLICY "Admins can manage leads" 
ON leads 
FOR ALL 
USING (is_admin(auth.uid()));

-- Fix canvassing activities policies for proper admin access
DROP POLICY IF EXISTS "Admins can manage canvassing activities" ON canvassing_activities;
CREATE POLICY "Admins can manage canvassing activities" 
ON canvassing_activities 
FOR ALL 
USING (is_admin(auth.uid()));
