
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InlineEditor } from "@/components/InlineEditor";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Home, Building, Wrench, Paintbrush, Hammer, TreePine } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ServiceContent {
  hero_title: string;
  hero_description: string;
  services_intro: string;
}

const defaultServices = [
  {
    id: "custom-homes",
    icon: Home,
    title: "Custom Home Building",
    description: "From foundation to finish, we create custom homes that reflect your unique vision and lifestyle.",
    features: ["Custom Design", "Quality Materials", "Energy Efficient"]
  },
  {
    id: "commercial",
    icon: Building,
    title: "Commercial Construction",
    description: "Professional commercial buildings designed for functionality, durability, and aesthetic appeal.",
    features: ["Office Buildings", "Retail Spaces", "Warehouses"]
  },
  {
    id: "renovations",
    icon: Wrench,
    title: "Renovations & Remodeling",
    description: "Transform your existing space with our comprehensive renovation and remodeling services.",
    features: ["Kitchen Remodels", "Bathroom Updates", "Room Additions"]
  },
  {
    id: "interior",
    icon: Paintbrush,
    title: "Interior Finishing",
    description: "Expert interior finishing services to bring your vision to life with premium craftsmanship.",
    features: ["Custom Millwork", "Flooring", "Paint & Trim"]
  },
  {
    id: "contracting",
    icon: Hammer,
    title: "General Contracting",
    description: "Full-service general contracting for projects of all sizes with end-to-end project management.",
    features: ["Project Management", "Permits & Licensing", "Quality Control"]
  },
  {
    id: "sustainable",
    icon: TreePine,
    title: "Sustainable Building",
    description: "Eco-friendly construction practices using sustainable materials and energy-efficient designs.",
    features: ["Green Materials", "Solar Ready", "LEED Certified"]
  }
];

const Services = () => {
  const { isAdmin } = useAuth();
  const [content, setContent] = useState<ServiceContent>({
    hero_title: "Our Construction Services",
    hero_description: "Comprehensive construction services delivered with unmatched quality and attention to detail",
    services_intro: "We offer a complete range of construction services designed to meet your unique needs and exceed your expectations."
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('field_name, content')
        .eq('section', 'services_page');

      if (error) {
        console.error('Error loading services content:', error);
        return;
      }

      if (data && data.length > 0) {
        const contentMap = data.reduce((acc, item) => {
          acc[item.field_name] = item.content;
          return acc;
        }, {} as Record<string, string>);

        setContent(prev => ({
          ...prev,
          ...contentMap
        }));
      }
    } catch (error) {
      console.error('Error loading services content:', error);
    }
  };

  const saveContent = async (field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert(
          {
            section: 'services_page',
            field_name: field,
            content: value,
            content_type: 'text'
          },
          {
            onConflict: 'section,field_name'
          }
        );

      if (error) {
        console.error('Error saving content:', error);
        return false;
      }

      setContent(prev => ({
        ...prev,
        [field]: value
      }));

      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <InlineEditor
            content={content.hero_title}
            onSave={(value) => saveContent('hero_title', value)}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            placeholder="Services Page Title"
          />
          <InlineEditor
            content={content.hero_description}
            onSave={(value) => saveContent('hero_description', value)}
            multiline
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto"
            placeholder="Services page description"
          />
        </div>
      </section>

      {/* Services Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <InlineEditor
            content={content.services_intro}
            onSave={(value) => saveContent('services_intro', value)}
            multiline
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            placeholder="Introduction to your services"
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultServices.map((service, index) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 px-8 py-4">
                  <button className="text-blue-800 font-semibold hover:text-blue-700 transition-colors duration-200">
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
