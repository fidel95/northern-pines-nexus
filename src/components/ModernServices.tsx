
import { Hammer, Building, Wrench, Leaf, Users, Award } from 'lucide-react';
import { InlineEditor } from './InlineEditor';
import { useHomepageContent } from '@/hooks/useHomepageContent';

export const ModernServices = () => {
  const { content, updateContent } = useHomepageContent();
  const servicesContent = content.services || {};

  const services = [
    {
      icon: Building,
      title: 'Custom Home Building',
      description: 'From foundation to finish, we build homes that reflect your unique vision and lifestyle.',
    },
    {
      icon: Hammer,
      title: 'Commercial Construction',
      description: 'Professional commercial spaces designed and built to meet your business needs.',
    },
    {
      icon: Wrench,
      title: 'Renovations & Remodeling',
      description: 'Transform your existing space with our expert renovation and remodeling services.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Building',
      description: 'Eco-friendly construction practices for a greener, more efficient future.',
    },
    {
      icon: Users,
      title: 'Project Management',
      description: 'Complete project oversight from planning to completion with transparent communication.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous quality control processes ensure every project meets our high standards.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <InlineEditor
            content={servicesContent.title || 'Our Construction Services'}
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
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
            >
              <div className="bg-blue-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-white" />
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
