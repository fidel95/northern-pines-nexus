
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InlineEditor } from "@/components/InlineEditor";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProjectContent {
  hero_title: string;
  hero_description: string;
  projects_intro: string;
}

const defaultProjects = [
  {
    id: "luxury-home",
    title: "Luxury Family Home",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
    description: "Modern 4-bedroom family home with sustainable features and contemporary design elements."
  },
  {
    id: "office-building",
    title: "Corporate Office Building",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop",
    description: "20,000 sq ft office complex with modern amenities and energy-efficient systems."
  },
  {
    id: "mountain-cabin",
    title: "Mountain Cabin Retreat",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop",
    description: "Rustic cabin design with contemporary interior and breathtaking mountain views."
  },
  {
    id: "retail-center",
    title: "Retail Shopping Center",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
    description: "Multi-tenant retail complex with ample parking and modern commercial facilities."
  },
  {
    id: "modern-duplex",
    title: "Modern Duplex Design",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    description: "Contemporary duplex with smart home technology and sustainable building materials."
  },
  {
    id: "warehouse-facility",
    title: "Industrial Warehouse",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop",
    description: "Large-scale warehouse facility with advanced logistics and storage solutions."
  }
];

const Projects = () => {
  const { isAdmin } = useAuth();
  const [content, setContent] = useState<ProjectContent>({
    hero_title: "Our Project Portfolio",
    hero_description: "Explore our portfolio of completed projects showcasing quality craftsmanship and innovative design",
    projects_intro: "From residential homes to commercial buildings, each project represents our commitment to excellence and attention to detail."
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('field_name, content')
        .eq('section', 'projects_page');

      if (error) {
        console.error('Error loading projects content:', error);
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
      console.error('Error loading projects content:', error);
    }
  };

  const saveContent = async (field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert(
          {
            section: 'projects_page',
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
            placeholder="Projects Page Title"
          />
          <InlineEditor
            content={content.hero_description}
            onSave={(value) => saveContent('hero_description', value)}
            multiline
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto"
            placeholder="Projects page description"
          />
        </div>
      </section>

      {/* Projects Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <InlineEditor
            content={content.projects_intro}
            onSave={(value) => saveContent('projects_intro', value)}
            multiline
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            placeholder="Introduction to your projects"
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultProjects.map((project, index) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200">
                    View Details →
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

export default Projects;
