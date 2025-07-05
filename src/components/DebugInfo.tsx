
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCanvasserAuth } from '@/contexts/CanvasserAuthContext';

export const DebugInfo: React.FC = () => {
  const auth = useAuth();
  const canvasserAuth = useCanvasserAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm border border-gray-700 z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Auth Loading: {auth.isLoading ? 'Yes' : 'No'}</div>
        <div>User: {auth.user ? auth.user.email : 'None'}</div>
        <div>Admin: {auth.isAdmin ? 'Yes' : 'No'}</div>
        <div>Canvasser: {auth.isCanvasser ? 'Yes' : 'No'}</div>
        <div>Auth Error: {auth.error || 'None'}</div>
        <div>Canvasser Loading: {canvasserAuth.isLoading ? 'Yes' : 'No'}</div>
        <div>Canvasser User: {canvasserAuth.canvasser ? canvasserAuth.canvasser.email : 'None'}</div>
      </div>
    </div>
  );
};
