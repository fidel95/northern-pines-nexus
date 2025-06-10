
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  supplier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admins table (separate from auth.users for admin management)
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = $1
  );
$$;

-- Create RLS policies for admin-only tables (leads, inventory, admins)
CREATE POLICY "Admins can manage leads" ON public.leads
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage inventory" ON public.inventory
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view admins" ON public.admins
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert admins" ON public.admins
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete other admins" ON public.admins
  FOR DELETE USING (public.is_admin(auth.uid()) AND user_id != auth.uid());

-- Create trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data for testing
INSERT INTO public.leads (name, email, phone, service, message, status) VALUES
  ('John Smith', 'john@example.com', '+1234567890', 'Custom Home Building', 'I would like to build a custom home with sustainable materials.', 'New'),
  ('Sarah Johnson', 'sarah@example.com', '+1987654321', 'Renovations & Remodeling', 'Kitchen renovation needed for my home.', 'Contacted'),
  ('Mike Wilson', 'mike@example.com', '+1555123456', 'Commercial Construction', 'Office building construction project.', 'Quoted');

INSERT INTO public.inventory (name, category, quantity, min_stock, unit, price, supplier) VALUES
  ('2x4 Lumber', 'Lumber', 150, 50, 'pieces', 8.50, 'Pine Valley Lumber'),
  ('Concrete Mix', 'Concrete', 25, 10, 'bags', 12.99, 'Northern Concrete Supply'),
  ('Roofing Shingles', 'Roofing', 8, 15, 'bundles', 89.99, 'Alpine Roofing Materials');
