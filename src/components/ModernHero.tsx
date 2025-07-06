
import { ArrowRight, Award, Users, Clock, Star } from "lucide-react";

export const ModernHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                Building Dreams with
                <span className="block text-yellow-400 mt-2">Northern Precision</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-green-100 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                Northern Pines Construction Services LLC brings over 20 years of expertise to every project. 
                From custom homes to commercial buildings, we deliver quality craftsmanship that stands the test of time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button className="bg-yellow-500 text-green-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center group">
                Get Free Quote
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-800 transition-all duration-300 hover:shadow-xl">
                View Our Work
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
              <div className="flex items-center space-x-2 text-green-100">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">20+ Years Experience</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">100% Satisfaction</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Feature Cards */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 space-y-6 border border-white border-opacity-20 shadow-2xl">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Why Choose Northern Pines?</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 group hover:bg-white hover:bg-opacity-10 p-3 rounded-xl transition-all duration-300">
                  <div className="bg-yellow-500 rounded-full p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-green-900" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-base sm:text-lg text-white mb-1">20+ Years Experience</h4>
                    <p className="text-green-100 text-sm sm:text-base leading-relaxed">Proven track record of excellence in construction and renovation projects</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group hover:bg-white hover:bg-opacity-10 p-3 rounded-xl transition-all duration-300">
                  <div className="bg-yellow-500 rounded-full p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-green-900" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-base sm:text-lg text-white mb-1">Expert Team</h4>
                    <p className="text-green-100 text-sm sm:text-base leading-relaxed">Licensed, insured professionals committed to quality craftsmanship</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group hover:bg-white hover:bg-opacity-10 p-3 rounded-xl transition-all duration-300">
                  <div className="bg-yellow-500 rounded-full p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-green-900" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-base sm:text-lg text-white mb-1">On-Time Delivery</h4>
                    <p className="text-green-100 text-sm sm:text-base leading-relaxed">Projects completed on schedule with attention to every detail</p>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white border-opacity-20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">500+</div>
                  <div className="text-xs text-green-100">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">100%</div>
                  <div className="text-xs text-green-100">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">20+</div>
                  <div className="text-xs text-green-100">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
