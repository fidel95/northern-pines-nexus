
import { Button } from '@/components/ui/button';
import { InlineEditor } from './InlineEditor';
import { useHomepageContent } from '@/hooks/useHomepageContent';

export const ModernHero = () => {
  const { content, updateContent } = useHomepageContent();
  const heroContent = content.hero || {};

  return (
    <section className="relative bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white py-24 lg:py-32 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <InlineEditor
            content={heroContent.title || 'Professional Construction Services'}
            onSave={(content) => updateContent('hero', 'title', content)}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          />
          
          <InlineEditor
            content={heroContent.subtitle || 'Northern Pines Construction - Building Excellence Since 2003'}
            onSave={(content) => updateContent('hero', 'subtitle', content)}
            className="text-xl md:text-2xl text-blue-200 mb-8 font-light"
          />
          
          <InlineEditor
            content={heroContent.description || 'Transform your vision into reality with our expert construction team.'}
            onSave={(content) => updateContent('hero', 'description', content)}
            multiline
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <InlineEditor
                content={heroContent.cta_text || 'Get Free Quote'}
                onSave={(content) => updateContent('hero', 'cta_text', content)}
                className="text-white"
              />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
            >
              View Our Work
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};
