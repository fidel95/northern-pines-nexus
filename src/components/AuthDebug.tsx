import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const AuthDebug = () => {
  const { user, isAdmin, isCanvasser, isLoading, error } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-900 text-white p-4 rounded-lg text-xs max-w-sm z-50 border border-red-600">
      <h3 className="font-bold mb-2 text-red-100">Auth Debug</h3>
      <div className="space-y-1 text-red-200">
        <p>User: {user?.email || 'None'}</p>
        <p>ID: {user?.id || 'None'}</p>
        <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
        <p>Canvasser: {isCanvasser ? 'Yes' : 'No'}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        {error && <p className="text-red-400">Error: {error}</p>}
      </div>
    </div>
  );
};