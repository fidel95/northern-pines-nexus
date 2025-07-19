
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const DebugInfo = () => {
  const { user, isAdmin, isCanvasser, isLoading, error } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <p>User: {user?.email || 'None'}</p>
        <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
        <p>Canvasser: {isCanvasser ? 'Yes' : 'No'}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        {error && <p className="text-red-400">Error: {error}</p>}
      </div>
    </div>
  );
};
