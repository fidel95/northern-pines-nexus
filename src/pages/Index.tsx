
import { useState, useEffect } from "react";
import { ModernHero } from "@/components/ModernHero";
import { ModernServices } from "@/components/ModernServices";
import { ModernTestimonials } from "@/components/ModernTestimonials";
import { ModernGallery } from "@/components/ModernGallery";
import { ModernContactForm } from "@/components/ModernContactForm";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ContentEditor } from "@/components/ContentEditor";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

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
  const { user, isAdmin, isLoading } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [customSections, setCustomSections] = useState<ContentSection[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // Load custom sections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('homepage-sections');
    if (saved) {
      try {
        setCustomSections(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved sections:', error);
        setCustomSections([]);
      }
    }
  }, []);

  // Save custom sections to localStorage
  const handleSectionsChange = (sections: ContentSection[]) => {
    try {
      setCustomSections(sections);
      localStorage.setItem('homepage-sections', JSON.stringify(sections));
      toast({
        title: "Content Saved",
        description: "Your homepage changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving sections:', error);
      toast({
        title: "Save Error",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleEditMode = () => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to edit the homepage.",
        variant: "destructive",
      });
      return;
    }
    
    setEditLoading(true);
    setTimeout(() => {
      setIsEditMode(!isEditMode);
      setEditLoading(false);
      
      if (!isEditMode) {
        toast({
          title: "Edit Mode Enabled",
          description: "You can now edit the homepage content.",
        });
      } else {
        toast({
          title: "Preview Mode",
          description: "Switched back to preview mode.",
        });
      }
    }, 100);
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
              <img 
                src={section.imageUrl} 
                alt={section.title || 'Custom image'} 
                className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </section>
        );
      case 'button':
        return (
          <section key={section.id} className="py-16 bg-gray-50 text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.title && <h2 className="text-3xl font-bold text-gray-900 mb-8">{section.title}</h2>}
              <Button asChild className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg">
                <a href={section.buttonLink || '#'}>{section.buttonText}</a>
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
      {!isLoading && user && isAdmin && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={toggleEditMode}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            disabled={editLoading}
          >
            {editLoading ? (
              'Loading...'
            ) : (
              <>
                {isEditMode ? <Eye className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditMode ? 'Preview' : 'Edit Page'}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Edit Mode */}
      {isEditMode && user && isAdmin && (
        <div className="bg-gray-900 p-6 border-b border-gray-700">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Homepage Content</h2>
            <ContentEditor sections={customSections} onSectionsChange={handleSectionsChange} />
          </div>
        </div>
      )}

      {/* Homepage Content */}
      {isEditMode && customSections.length > 0 ? (
        // Show custom sections in edit mode
        customSections.map(renderCustomSection)
      ) : isEditMode && customSections.length === 0 ? (
        // Show message when no custom sections in edit mode
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 my-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No custom sections found. Add sections using the editor above to customize your homepage.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Show default homepage content
        <>
          <ModernHero />
          <ModernServices />
          <ModernGallery />
          <ModernTestimonials />
          <ModernContactForm />
        </>
      )}

      <Footer />
    </div>
  );
};

export default Index;
