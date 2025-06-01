
export const Projects = () => {
  const projects = [
    {
      title: "Luxury Family Home",
      category: "Residential",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
      description: "Modern 4-bedroom family home with sustainable features"
    },
    {
      title: "Corporate Office Building",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop",
      description: "20,000 sq ft office complex with modern amenities"
    },
    {
      title: "Mountain Cabin Retreat",
      category: "Residential",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop",
      description: "Rustic cabin design with contemporary interior"
    },
    {
      title: "Retail Shopping Center",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
      description: "Multi-tenant retail complex with parking facilities"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our portfolio of completed projects showcasing quality craftsmanship and innovative design
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <button className="text-green-800 font-semibold hover:text-green-700 transition-colors duration-200">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-green-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};
