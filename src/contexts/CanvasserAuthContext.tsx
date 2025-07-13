
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
    let initTimeout: NodeJS.Timeout;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Canvasser auth state changed:', event, session?.user?.email);
        
        // Clear any existing timeout
        if (initTimeout) clearTimeout(initTimeout);
        
        if (session?.user) {
          try {
            console.log('Fetching canvasser data for email:', session.user.email);
            
            const { data: directData, error: directError } = await supabase
              .from('canvassers')
              .select('*')
              .eq('email', session.user.email)
              .eq('active', true)
              .limit(1);
            
            if (directError) {
              console.error('Direct query failed:', directError);
              if (mounted) {
                setCanvasser(null);
                setIsLoading(false);
              }
              return;
            }
            
            if (directData && directData.length > 0 && mounted) {
              setCanvasser(directData[0]);
              console.log('Canvasser data loaded successfully:', directData[0].name);
            } else {
              console.log('No canvasser found for email:', session.user.email);
              if (mounted) setCanvasser(null);
            }
            
          } catch (error) {
            console.error('Exception fetching canvasser data:', error);
            if (mounted) setCanvasser(null);
          }
        } else {
          console.log('No session user, clearing canvasser data');
          if (mounted) setCanvasser(null);
        }
        
        // Always clear loading state
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setIsLoading(true);
          
          const { data: directData, error: directError } = await supabase
            .from('canvassers')
            .select('*')
            .eq('email', session.user.email)
            .eq('active', true)
            .limit(1);
          
          if (!directError && directData && directData.length > 0) {
            setCanvasser(directData[0]);
            console.log('Initial canvasser session loaded:', directData[0].name);
          } else {
            console.log('No canvasser found in initial session check');
          }
        }
      } catch (error) {
        console.error('Error checking canvasser session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      if (initTimeout) clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting canvasser sign in for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Canvasser auth error:', error);
        setIsLoading(false); // Set loading to false on auth error
        return { error };
      }
      
      console.log('Canvasser auth successful, waiting for auth state change...');
      return { error: null };
    } catch (error) {
      console.error('Canvasser sign in exception:', error);
      setIsLoading(false); // Set loading to false on exception
      return { error: error as AuthError };
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
