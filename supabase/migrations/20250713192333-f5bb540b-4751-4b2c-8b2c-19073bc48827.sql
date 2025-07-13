-- Fix RLS policies for canvassers - add INSERT policy for admins to create canvassers
CREATE POLICY "Admins can insert canvassers" 
ON canvassers 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Update the canvasser query policies to be more efficient
DROP POLICY IF EXISTS "Canvassers can view their own data" ON canvassers;
DROP POLICY IF EXISTS "Canvassers can update their own data" ON canvassers;

-- Create more efficient policies using auth.email() if available
CREATE POLICY "Canvassers can view their own data" 
ON canvassers 
FOR SELECT 
USING (
  email = COALESCE(
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    auth.email()
  )
);

CREATE POLICY "Canvassers can update their own data" 
ON canvassers 
FOR UPDATE 
USING (
  email = COALESCE(
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    auth.email()
  )
);