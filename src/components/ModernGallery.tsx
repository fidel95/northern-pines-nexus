
import { InlineEditor } from './InlineEditor';
import { useHomepageContent } from '@/hooks/useHomepageContent';

export const ModernGallery = () => {
  const { content, updateContent } = useHomepageContent();
  const galleryContent = content.gallery || {};

  const projects = [
    {
      title: 'Modern Family Home',
      image: '/placeholder.svg',
      category: 'Residential',
    },
    {
      title: 'Commercial Office Building',
      image: '/placeholder.svg',
      category: 'Commercial',
    },
    {
      title: 'Kitchen Renovation',
      image: '/placeholder.svg',
      category: 'Renovation',
    },
    {
      title: 'Sustainable Home',
      image: '/placeholder.svg',
      category: 'Green Building',
    },
    {
      title: 'Retail Space',
      image: '/placeholder.svg',
      category: 'Commercial',
    },
    {
      title: 'Home Addition',
      image: '/placeholder.svg',
      category: 'Addition',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <InlineEditor
            content={galleryContent.title || 'Recent Projects'}
            onSave={(content) => updateContent('gallery', 'title', content)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          />
          <InlineEditor
            content={galleryContent.description || 'Take a look at some of our recent construction projects'}
            onSave={(content) => updateContent('gallery', 'description', content)}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600">Professional construction with attention to detail</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};
