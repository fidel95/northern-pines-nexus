
import { ArrowRight, Award, Users, Clock } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Building Dreams with
              <span className="text-yellow-400 block">Northern Precision</span>
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Northern Pines Construction Services LLC brings over 20 years of expertise to every project. 
              From custom homes to commercial buildings, we deliver quality craftsmanship that stands the test of time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-yellow-500 text-green-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                Get Free Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-800 transition-all duration-300">
                View Our Work
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
              <h3 className="text-2xl font-bold mb-6">Why Choose Northern Pines?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-500 rounded-full p-3">
                    <Award className="w-6 h-6 text-green-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold">20+ Years Experience</h4>
                    <p className="text-green-100">Proven track record of excellence</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-500 rounded-full p-3">
                    <Users className="w-6 h-6 text-green-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Expert Team</h4>
                    <p className="text-green-100">Licensed & insured professionals</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-500 rounded-full p-3">
                    <Clock className="w-6 h-6 text-green-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold">On-Time Delivery</h4>
                    <p className="text-green-100">Projects completed on schedule</p>
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
