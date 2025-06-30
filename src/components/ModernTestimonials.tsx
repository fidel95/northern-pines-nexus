
import { Star, Quote } from 'lucide-react';
import { InlineEditor } from './InlineEditor';
import { useHomepageContent } from '@/hooks/useHomepageContent';

export const ModernTestimonials = () => {
  const { content, updateContent } = useHomepageContent();
  const testimonialContent = content.testimonial || {};

  return (
    <section className="py-20 bg-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-4xl mx-auto relative">
            <Quote className="w-12 h-12 text-blue-600 mx-auto mb-6" />
            
            <InlineEditor
              content={testimonialContent.quote || 'Northern Pines transformed our vision into a beautiful reality. Their attention to detail and professionalism exceeded our expectations.'}
              onSave={(content) => updateContent('testimonial', 'quote', content)}
              multiline
              className="text-xl md:text-2xl text-gray-800 font-medium italic mb-8 leading-relaxed"
            />
            
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <InlineEditor
                content={testimonialContent.author || 'Sarah Johnson'}
                onSave={(content) => updateContent('testimonial', 'author', content)}
                className="text-lg font-bold text-gray-900"
              />
              <InlineEditor
                content={testimonialContent.position || 'Homeowner'}
                onSave={(content) => updateContent('testimonial', 'position', content)}
                className="text-blue-600 font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
