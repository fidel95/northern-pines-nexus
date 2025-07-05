
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCanvasser?: boolean;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requireCanvasser = false,
  requireAuth = true 
}) => {
  const { user, isAdmin, isCanvasser, isLoading, error, signOut, refreshSession } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Auth State:', { user: !!user, isAdmin, isCanvasser, isLoading, error });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ErrorDisplay 
          error={`Authentication Error: ${error}`}
          onRetry={refreshSession}
        />
      </div>
    );
  }

  if (requireAuth && !user) {
    console.log('ProtectedRoute - Redirecting to auth, no user found');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin privileges to access this area.</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In as Admin
            </Button>
            <Button 
              onClick={signOut}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-900 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (requireCanvasser && !isCanvasser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need canvasser access to view this area.</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/canvasser-auth'}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In as Canvasser
            </Button>
            <Button 
              onClick={signOut}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-900 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
