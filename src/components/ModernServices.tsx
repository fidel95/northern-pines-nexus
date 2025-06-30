
import { Home, Building2, Hammer, Wrench, TreePine, Shield } from 'lucide-react';
import { InlineEditor } from './InlineEditor';
import { useHomepageContent } from '@/hooks/useHomepageContent';

const services = [
  {
    icon: Home,
    title: 'Custom Home Building',
    description: 'From concept to completion, we build homes that reflect your unique style and needs.'
  },
  {
    icon: Building2,
    title: 'Commercial Construction',
    description: 'Professional commercial spaces designed for functionality and aesthetic appeal.'
  },
  {
    icon: Hammer,
    title: 'Renovations & Remodeling',
    description: 'Transform your existing space with our expert renovation and remodeling services.'
  },
  {
    icon: Wrench,
    title: 'Interior Finishing',
    description: 'High-quality interior finishes that add value and beauty to your property.'
  },
  {
    icon: TreePine,
    title: 'Sustainable Building',
    description: 'Eco-friendly construction practices for a greener, more efficient future.'
  },
  {
    icon: Shield,
    title: 'General Contracting',
    description: 'Comprehensive project management from permits to final inspection.'
  }
];

export const ModernServices = () => {
  const { content, updateContent } = useHomepageContent();
  const servicesContent = content.services || {};

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <InlineEditor
            content={servicesContent.title || 'Our Services'}
            onSave={(content) => updateContent('services', 'title', content)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          />
          <InlineEditor
            content={servicesContent.description || 'Comprehensive construction solutions tailored to your needs'}
            onSave={(content) => updateContent('services', 'description', content)}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
