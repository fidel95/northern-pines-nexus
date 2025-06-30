
import { useState, useEffect } from "react";
import { ModernHero } from "@/components/ModernHero";
import { ModernServices } from "@/components/ModernServices";
import { ModernTestimonials } from "@/components/ModernTestimonials";
import { ModernContactForm } from "@/components/ModernContactForm";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ContentEditor } from "@/components/ContentEditor";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

interface ContentSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'button';
  title?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
}

const Index = () => {
  const { user, isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [customSections, setCustomSections] = useState<ContentSection[]>([]);

  // Load custom sections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('homepage-sections');
    if (saved) {
      setCustomSections(JSON.parse(saved));
    }
  }, []);

  // Save custom sections to localStorage
  const handleSectionsChange = (sections: ContentSection[]) => {
    setCustomSections(sections);
    localStorage.setItem('homepage-sections', JSON.stringify(sections));
  };

  const renderCustomSection = (section: ContentSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={section.id} className="bg-black text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{section.title}</h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">{section.content}</p>
            </div>
          </section>
        );
      case 'text':
        return (
          <section key={section.id} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
              <p className="text-lg text-gray-600 whitespace-pre-wrap">{section.content}</p>
            </div>
          </section>
        );
      case 'image':
        return (
          <section key={section.id} className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {section.title && <h2 className="text-3xl font-bold text-gray-900 mb-8">{section.title}</h2>}
              <img src={section.imageUrl} alt={section.title || 'Custom image'} className="mx-auto max-w-full h-auto rounded-lg shadow-lg" />
            </div>
          </section>
        );
      case 'button':
        return (
          <section key={section.id} className="py-16 bg-gray-50 text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.title && <h2 className="text-3xl font-bold text-gray-900 mb-8">{section.title}</h2>}
              <Button asChild className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg">
                <a href={section.buttonLink}>{section.buttonText}</a>
              </Button>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Admin Edit Controls - Only show if admin is logged in */}
      {user && isAdmin && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            {isEditMode ? <Eye className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isEditMode ? 'Preview' : 'Edit Page'}
          </Button>
        </div>
      )}

      {/* Edit Mode */}
      {isEditMode && user && isAdmin && (
        <div className="bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Homepage Content</h2>
            <ContentEditor sections={customSections} onSectionsChange={handleSectionsChange} />
          </div>
        </div>
      )}

      {/* Modern Homepage Sections */}
      {!isEditMode && (
        <>
          <ModernHero />
          <ModernServices />
          <ModernTestimonials />
          <ModernContactForm />
        </>
      )}

      {/* Custom Sections - Only when in edit mode */}
      {isEditMode && customSections.map(renderCustomSection)}

      {/* Legacy Sections - Only show when in edit mode and no custom sections */}
      {isEditMode && customSections.length === 0 && (
        <>
          <About />
          <Projects />
        </>
      )}

      <Footer />
    </div>
  );
};

export default Index;
