
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CanvasserAuthProvider } from "@/contexts/CanvasserAuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CanvasserDashboard = lazy(() => import("./pages/CanvasserDashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const CanvasserAuth = lazy(() => import("./pages/CanvasserAuth"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
  },
});

const AppLoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <LoadingSpinner message="Loading application..." size="lg" />
  </div>
);

function App() {
  console.log('App component rendering...');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CanvasserAuthProvider>
              <BrowserRouter>
                <div className="min-h-screen">
                  <Suspense fallback={<AppLoadingFallback />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/about-us" element={<AboutUs />} />
                      <Route path="/contact-us" element={<ContactUs />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/projects" element={<Projects />} />
                      
                      {/* Auth Routes */}
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/canvasser-auth" element={<CanvasserAuth />} />
                      
                      {/* Protected Admin Routes */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute requireAdmin>
                            <Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Protected Canvasser Routes */}
                      <Route 
                        path="/canvasser-dashboard" 
                        element={
                          <ProtectedRoute requireCanvasser>
                            <CanvasserDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <Toaster />
                </div>
              </BrowserRouter>
            </CanvasserAuthProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
