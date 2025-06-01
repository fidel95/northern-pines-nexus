
import { CheckCircle, Award, Users, Calendar } from "lucide-react";

export const About = () => {
  const stats = [
    { icon: Calendar, number: "20+", label: "Years Experience" },
    { icon: Users, number: "500+", label: "Happy Clients" },
    { icon: CheckCircle, number: "1000+", label: "Projects Completed" },
    { icon: Award, number: "50+", label: "Awards Won" }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Building Excellence Since 2003
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Northern Pines Construction Services LLC has been a trusted name in construction throughout 
                the northern region. Our commitment to quality craftsmanship, sustainable practices, and 
                customer satisfaction has made us the preferred choice for homeowners and businesses alike.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We combine traditional building techniques with modern technology to deliver projects that 
                exceed expectations. Our team of skilled craftsmen and project managers work closely with 
                clients to bring their vision to life while maintaining the highest standards of quality and safety.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Licensed & Insured</h4>
                  <p className="text-gray-600">Fully licensed contractors with comprehensive insurance coverage</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Quality Guarantee</h4>
                  <p className="text-gray-600">We stand behind our work with comprehensive warranties</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Sustainable Practices</h4>
                  <p className="text-gray-600">Committed to environmentally responsible construction methods</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-800 to-green-700 text-white p-8 rounded-xl text-center transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
