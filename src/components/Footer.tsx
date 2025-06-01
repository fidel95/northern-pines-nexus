
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4">Northern Pines Construction Services LLC</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Building excellence since 2003. We specialize in custom homes, commercial construction, 
              and sustainable building practices throughout the northern region.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white cursor-pointer transition-colors">Custom Home Building</li>
              <li className="hover:text-white cursor-pointer transition-colors">Commercial Construction</li>
              <li className="hover:text-white cursor-pointer transition-colors">Renovations & Remodeling</li>
              <li className="hover:text-white cursor-pointer transition-colors">Interior Finishing</li>
              <li className="hover:text-white cursor-pointer transition-colors">General Contracting</li>
              <li className="hover:text-white cursor-pointer transition-colors">Sustainable Building</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                (555) 123-4567
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                info@northernpines.com
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <div>
                  123 Pine Street<br />
                  Northern Valley, NH 03304
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Northern Pines Construction Services LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
