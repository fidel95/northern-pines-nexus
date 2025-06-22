
-- Create salespeople table
CREATE TABLE public.salespeople (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  job_types TEXT[], -- Array of job types they handle
  commission_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- Percentage with 2 decimal places
  total_profit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  total_sales DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  estimated_amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create calendar events table
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  salesperson_id UUID REFERENCES public.salespeople(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add salesperson_id to leads table
ALTER TABLE public.leads 
ADD COLUMN salesperson_id UUID REFERENCES public.salespeople(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.salespeople ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin-only access
CREATE POLICY "Admins can manage salespeople" ON public.salespeople
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage quotes" ON public.quotes
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage calendar events" ON public.calendar_events
  FOR ALL USING (public.is_admin(auth.uid()));

-- Insert sample data
INSERT INTO public.salespeople (name, email, phone, job_types, commission_percentage) VALUES
  ('John Smith', 'john.smith@company.com', '+1234567890', ARRAY['Custom Home Building', 'Renovations & Remodeling'], 5.50),
  ('Sarah Johnson', 'sarah.johnson@company.com', '+1987654321', ARRAY['Commercial Construction', 'General Contracting'], 6.00),
  ('Mike Wilson', 'mike.wilson@company.com', '+1555123456', ARRAY['Interior Finishing', 'Sustainable Building'], 5.75);

INSERT INTO public.quotes (client_name, service_type, estimated_amount, status) VALUES
  ('ABC Corporation', 'Commercial Construction', 125000.00, 'pending'),
  ('Johnson Family', 'Custom Home Building', 75000.00, 'pending'),
  ('Green Tech Solutions', 'Sustainable Building', 95000.00, 'approved');
