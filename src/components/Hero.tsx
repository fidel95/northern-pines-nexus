
import { ArrowRight, Award, Users, Clock } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Building Dreams with
              <span className="text-yellow-400 block">Northern Precision</span>
            </h1>
            <p className="text-lg sm:text-xl text-green-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Northern Pines Construction Services LLC brings over 20 years of expertise to every project. 
              From custom homes to commercial buildings, we deliver quality craftsmanship that stands the test of time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-yellow-500 text-green-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                Get Free Quote
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white hover:text-green-800 transition-all duration-300">
                View Our Work
              </button>
            </div>
          </div>
          
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center lg:text-left">Why Choose Northern Pines?</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-yellow-500 rounded-full p-2 sm:p-3 flex-shrink-0">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">20+ Years Experience</h4>
                    <p className="text-green-100 text-xs sm:text-sm">Proven track record of excellence</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-yellow-500 rounded-full p-2 sm:p-3 flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">Expert Team</h4>
                    <p className="text-green-100 text-xs sm:text-sm">Licensed & insured professionals</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-yellow-500 rounded-full p-2 sm:p-3 flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">On-Time Delivery</h4>
                    <p className="text-green-100 text-xs sm:text-sm">Projects completed on schedule</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
