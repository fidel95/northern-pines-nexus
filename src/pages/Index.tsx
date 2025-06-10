
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="fixed top-4 right-4 z-50">
        <Link to="/auth">
          <Button variant="outline" className="bg-white/90 backdrop-blur-sm hover:bg-white">
            <LogIn className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
        </Link>
      </div>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
