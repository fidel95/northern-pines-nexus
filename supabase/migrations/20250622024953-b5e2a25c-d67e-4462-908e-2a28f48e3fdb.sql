
-- Create canvassers table
CREATE TABLE public.canvassers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  assigned_territories TEXT[], -- Array of ZIP codes
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  total_visits INTEGER NOT NULL DEFAULT 0,
  leads_generated INTEGER NOT NULL DEFAULT 0,
  conversion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create canvassing activities table
CREATE TABLE public.canvassing_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  canvasser_id UUID NOT NULL REFERENCES public.canvassers(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  address TEXT NOT NULL,
  zip_code TEXT,
  result TEXT NOT NULL CHECK (result IN ('Not Interested', 'Maybe', 'Call Back', 'Interested')),
  notes TEXT,
  requires_followup BOOLEAN DEFAULT false,
  followup_priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table for salespeople
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salesperson_id UUID NOT NULL REFERENCES public.salespeople(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table for file uploads
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  salesperson_id UUID REFERENCES public.salespeople(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, success, error
  read BOOLEAN DEFAULT false,
  related_lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add canvasser_id to leads table
ALTER TABLE public.leads 
ADD COLUMN canvasser_id UUID REFERENCES public.canvassers(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.canvassers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvassing_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin-only access to canvassers and activities
CREATE POLICY "Admins can manage canvassers" ON public.canvassers
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage canvassing activities" ON public.canvassing_activities
  FOR ALL USING (public.is_admin(auth.uid()));

-- Tasks, documents, and notifications can be accessed by admins
CREATE POLICY "Admins can manage tasks" ON public.tasks
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage documents" ON public.documents
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (public.is_admin(auth.uid()));

-- Insert sample canvassers
INSERT INTO public.canvassers (name, email, phone, assigned_territories, hire_date) VALUES
  ('Alex Rodriguez', 'alex.rodriguez@company.com', '+1555111222', ARRAY['12345', '12346', '12347'], '2024-01-15'),
  ('Emma Thompson', 'emma.thompson@company.com', '+1555333444', ARRAY['12348', '12349', '12350'], '2024-02-01'),
  ('David Kim', 'david.kim@company.com', '+1555555666', ARRAY['12351', '12352', '12353'], '2024-03-10');

-- Insert sample canvassing activities
INSERT INTO public.canvassing_activities (canvasser_id, address, zip_code, result, notes) VALUES
  ((SELECT id FROM public.canvassers WHERE email = 'alex.rodriguez@company.com'), '123 Main St', '12345', 'Interested', 'Very interested in home renovation'),
  ((SELECT id FROM public.canvassers WHERE email = 'alex.rodriguez@company.com'), '456 Oak Ave', '12345', 'Maybe', 'Said to call back in 2 weeks'),
  ((SELECT id FROM public.canvassers WHERE email = 'emma.thompson@company.com'), '789 Pine Rd', '12348', 'Not Interested', 'Recently completed renovation');

-- Update canvasser stats
UPDATE public.canvassers SET 
  total_visits = 2,
  leads_generated = 1,
  conversion_rate = 50.00
WHERE email = 'alex.rodriguez@company.com';

UPDATE public.canvassers SET 
  total_visits = 1,
  leads_generated = 0,
  conversion_rate = 0.00
WHERE email = 'emma.thompson@company.com';
