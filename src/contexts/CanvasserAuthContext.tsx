
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Canvasser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  assigned_territories: string[] | null;
  hire_date: string;
  active: boolean;
}

interface CanvasserAuthContextType {
  canvasser: Canvasser | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
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
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if user is a canvasser
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
      setIsLoading(false);
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data, error } = await supabase
            .from('canvassers')
            .select('*')
            .eq('email', session.user.email)
            .eq('active', true)
            .single();
          
          if (!error && data) {
            setCanvasser(data);
          } else {
            setCanvasser(null);
          }
        } else {
          setCanvasser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCanvasser(null);
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
