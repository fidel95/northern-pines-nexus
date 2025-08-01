
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
    { name: "About", href: "/about-us", isExternal: false },
    { name: "Contact", href: "/contact-us", isExternal: false },
  ];

  const renderNavLink = (item: typeof navItems[0], isMobile = false) => {
    const baseClasses = isMobile 
      ? "text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
      : "text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors";

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
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-lg sm:text-xl font-bold text-foreground truncate">
              Northern Pines
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!isDashboard && navItems.map((item) => renderNavLink(item))}
              {isDashboard && (
                <Link
                  to="/"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
              )}
              {showDashboardLink && (
                <Link
                  to={isAdmin ? "/dashboard" : "/canvasser-dashboard"}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden xl:flex items-center space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-1" />
              <span className="hidden 2xl:inline">(555) 123-4567</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mr-1" />
              <span className="hidden 2xl:inline">info@northernpines.com</span>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
            {!isDashboard && navItems.map((item) => renderNavLink(item, true))}
            {isDashboard && (
              <Link
                to="/"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            )}
            {showDashboardLink && (
              <Link
                to={isAdmin ? "/dashboard" : "/canvasser-dashboard"}
                className="bg-primary text-primary-foreground block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/90 w-full text-center transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-4 pb-2 border-t border-border mt-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
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
