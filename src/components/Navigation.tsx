
import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/canvasser-dashboard';
  const { user, isAdmin, isCanvasser, isLoading } = useAuth();

  const navItems = [
    { name: "Home", href: "/", isExternal: false },
    { name: "Services", href: "/services", isExternal: false },
    { name: "Projects", href: "/projects", isExternal: false },
    { name: "About Us", href: "/about-us", isExternal: false },
    { name: "Contact Us", href: "/contact-us", isExternal: false },
  ];

  const renderNavLink = (item: typeof navItems[0], isMobile = false) => {
    const baseClasses = isMobile 
      ? "text-gray-700 hover:text-green-800 block px-3 py-2 rounded-md text-base font-medium"
      : "text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";

    return (
      <Link
        key={item.name}
        to={item.href}
        className={baseClasses}
        onClick={isMobile ? () => setIsOpen(false) : undefined}
      >
        {item.name}
      </Link>
    );
  };

  // Only show dashboard link if user is authenticated and has appropriate role
  // Don't show during loading to prevent flickering
  const showDashboardLink = !isLoading && user && (isAdmin || isCanvasser);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-lg sm:text-2xl font-bold text-green-800 truncate">
              Northern Pines Construction
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!isDashboard && navItems.map((item) => renderNavLink(item))}
              {isDashboard && (
                <Link
                  to="/"
                  className="text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Back to Website
                </Link>
              )}
              {showDashboardLink && (
                <Link
                  to={isAdmin ? "/dashboard" : "/canvasser-dashboard"}
                  className="bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  {isDashboard ? "Dashboard" : isAdmin ? "Admin Dashboard" : "Canvasser Dashboard"}
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden xl:flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-1" />
              <span className="hidden 2xl:inline">(555) 123-4567</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-1" />
              <span className="hidden 2xl:inline">info@northernpines.com</span>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-800 p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg border-t">
            {!isDashboard && navItems.map((item) => renderNavLink(item, true))}
            {isDashboard && (
              <Link
                to="/"
                className="text-gray-700 hover:text-green-800 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Back to Website
              </Link>
            )}
            {showDashboardLink && (
              <Link
                to={isAdmin ? "/dashboard" : "/canvasser-dashboard"}
                className="bg-green-800 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-700 w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                {isDashboard ? "Dashboard" : isAdmin ? "Admin Dashboard" : "Canvasser Dashboard"}
              </Link>
            )}
            <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  (555) 123-4567
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  info@northernpines.com
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
