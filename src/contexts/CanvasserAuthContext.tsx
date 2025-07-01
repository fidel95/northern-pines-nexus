
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Canvasser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  assigned_territories: string[] | null;
  hire_date: string;
  active: boolean;
  total_visits: number;
  leads_generated: number;
  conversion_rate: number;
}

interface CanvasserAuthContextType {
  canvasser: Canvasser | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const CanvasserAuthContext = createContext<CanvasserAuthContextType | undefined>(undefined);

export const useCanvasserAuth = () => {
  const context = useContext(CanvasserAuthContext);
  if (context === undefined) {
    throw new Error('useCanvasserAuth must be used within a CanvasserAuthProvider');
  }
  return context;
};

export const CanvasserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canvasser, setCanvasser] = useState<Canvasser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Canvasser auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          try {
            const { data, error } = await supabase
              .from('canvassers')
              .select('*')
              .eq('email', session.user.email)
              .eq('active', true)
              .single();
            
            if (!error && data && mounted) {
              setCanvasser(data);
            } else {
              if (mounted) setCanvasser(null);
            }
          } catch (error) {
            console.error('Error fetching canvasser data:', error);
            if (mounted) setCanvasser(null);
          }
        } else {
          if (mounted) setCanvasser(null);
        }
        
        if (mounted) setIsLoading(false);
      }
    );

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const { data, error } = await supabase
            .from('canvassers')
            .select('*')
            .eq('email', session.user.email)
            .eq('active', true)
            .single();
          
          if (!error && data) {
            setCanvasser(data);
          }
        }
      } catch (error) {
        console.error('Error checking canvasser session:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (error) {
      console.error('Canvasser sign in error:', error);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setCanvasser(null);
    } catch (error) {
      console.error('Canvasser sign out error:', error);
      setCanvasser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CanvasserAuthContext.Provider value={{
      canvasser,
      signIn,
      signOut,
      isLoading
    }}>
      {children}
    </CanvasserAuthContext.Provider>
  );
};
