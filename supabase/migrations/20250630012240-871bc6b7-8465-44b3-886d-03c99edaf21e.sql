
-- Create homepage_content table for dynamic content management
CREATE TABLE public.homepage_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- hero, services, testimonials, etc.
  field_name TEXT NOT NULL, -- title, subtitle, description, etc.
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text', -- text, html, image_url
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(section, field_name)
);

-- Create form_submissions table for contact form data
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'homepage', -- homepage, contact_page, etc.
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'responded', 'archived')),
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on new tables
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for homepage_content (admins only)
CREATE POLICY "Admins can manage homepage content" ON public.homepage_content
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Everyone can read homepage content" ON public.homepage_content
  FOR SELECT USING (true);

-- RLS policies for form_submissions (admins only)
CREATE POLICY "Admins can manage form submissions" ON public.form_submissions
  FOR ALL USING (public.is_admin(auth.uid()));

-- Insert default homepage content
INSERT INTO public.homepage_content (section, field_name, content, content_type) VALUES
  ('hero', 'title', 'Professional Construction Services', 'text'),
  ('hero', 'subtitle', 'Northern Pines Construction - Building Excellence Since 2003', 'text'),
  ('hero', 'description', 'Transform your vision into reality with our expert construction team. We specialize in custom homes, commercial buildings, and sustainable construction practices.', 'text'),
  ('hero', 'cta_text', 'Get Free Quote', 'text'),
  ('hero', 'background_image', '/placeholder.svg', 'image_url'),
  
  ('services', 'title', 'Our Services', 'text'),
  ('services', 'description', 'Comprehensive construction solutions tailored to your needs', 'text'),
  
  ('contact', 'title', 'Ready to Start Your Project?', 'text'),
  ('contact', 'description', 'Get in touch with our team for a free consultation and quote.', 'text'),
  
  ('testimonial', 'quote', 'Northern Pines transformed our vision into a beautiful reality. Their attention to detail and professionalism exceeded our expectations.', 'text'),
  ('testimonial', 'author', 'Sarah Johnson', 'text'),
  ('testimonial', 'position', 'Homeowner', 'text');
