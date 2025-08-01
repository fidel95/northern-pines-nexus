
import { ArrowRight, Award, Users, Clock, Star } from "lucide-react";

export const ModernHero = () => {
  return (
    <section className="relative bg-background text-foreground overflow-hidden min-h-screen border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-background"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Northern Pines
                <span className="block text-primary mt-2">Construction</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Quality construction services with 20+ years of expertise. 
                We deliver exceptional craftsmanship for your home and business needs.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-md font-medium text-lg hover:bg-primary/90 transition-colors flex items-center justify-center group">
                Get Quote
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-border text-foreground px-8 py-4 rounded-md font-medium text-lg hover:bg-muted transition-colors">
                Our Work
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">20+ Years Experience</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Quality Guarantee</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Feature Cards */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-semibold mb-6 text-foreground">Why Choose Us</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-3 rounded-md hover:bg-muted transition-colors">
                  <div className="bg-primary rounded-md p-2 flex-shrink-0">
                    <Award className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-foreground mb-1">Experience</h4>
                    <p className="text-muted-foreground text-sm">20+ years of construction expertise</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 rounded-md hover:bg-muted transition-colors">
                  <div className="bg-primary rounded-md p-2 flex-shrink-0">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-foreground mb-1">Expert Team</h4>
                    <p className="text-muted-foreground text-sm">Licensed & insured professionals</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 rounded-md hover:bg-muted transition-colors">
                  <div className="bg-primary rounded-md p-2 flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-foreground mb-1">Reliability</h4>
                    <p className="text-muted-foreground text-sm">On-time project completion</p>
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
