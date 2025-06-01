
import { Home, Building, Wrench, Paintbrush, Hammer, TreePine } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Custom Home Building",
      description: "From foundation to finish, we create custom homes that reflect your unique vision and lifestyle.",
      features: ["Custom Design", "Quality Materials", "Energy Efficient"]
    },
    {
      icon: Building,
      title: "Commercial Construction",
      description: "Professional commercial buildings designed for functionality, durability, and aesthetic appeal.",
      features: ["Office Buildings", "Retail Spaces", "Warehouses"]
    },
    {
      icon: Wrench,
      title: "Renovations & Remodeling",
      description: "Transform your existing space with our comprehensive renovation and remodeling services.",
      features: ["Kitchen Remodels", "Bathroom Updates", "Room Additions"]
    },
    {
      icon: Paintbrush,
      title: "Interior Finishing",
      description: "Expert interior finishing services to bring your vision to life with premium craftsmanship.",
      features: ["Custom Millwork", "Flooring", "Paint & Trim"]
    },
    {
      icon: Hammer,
      title: "General Contracting",
      description: "Full-service general contracting for projects of all sizes with end-to-end project management.",
      features: ["Project Management", "Permits & Licensing", "Quality Control"]
    },
    {
      icon: TreePine,
      title: "Sustainable Building",
      description: "Eco-friendly construction practices using sustainable materials and energy-efficient designs.",
      features: ["Green Materials", "Solar Ready", "LEED Certified"]
    }
  ];

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Comprehensive construction services delivered with unmatched quality and attention to detail
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="bg-green-800 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4 sm:mb-6">
                  <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-xs sm:text-sm text-gray-700">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 px-6 sm:px-8 py-3 sm:py-4">
                <button className="text-green-800 font-semibold hover:text-green-700 transition-colors duration-200 text-sm sm:text-base">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
