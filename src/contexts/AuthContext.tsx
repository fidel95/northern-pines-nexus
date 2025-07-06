import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAdmin: boolean;
  isCanvasser: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCanvasser, setIsCanvasser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUserRole = useCallback(async (userId: string, userEmail?: string) => {
    try {
      console.log('Checking user role for:', userId, userEmail);
      
      // Use a timeout to prevent indefinite hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Role check timeout')), 10000)
      );
      
      // Check admin status with timeout
      const adminPromise = supabase
        .from('admins')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      let canvasserPromise = Promise.resolve({ data: null, error: null });
      if (userEmail) {
        canvasserPromise = supabase
          .from('canvassers')
          .select('id, active')
          .eq('email', userEmail)
          .eq('active', true)
          .maybeSingle();
      }
      
      const [adminResult, canvasserResult] = await Promise.race([
        Promise.all([adminPromise, canvasserPromise]),
        timeoutPromise
      ]) as [any, any];
      
      const { data: adminData, error: adminError } = adminResult;
      const { data: canvasserData, error: canvasserError } = canvasserResult;
      
      if (adminError && adminError.code !== 'PGRST116') {
        console.error('Error checking admin status:', adminError);
      }
      
      if (canvasserError && canvasserError.code !== 'PGRST116') {
        console.error('Error checking canvasser status:', canvasserError);
      }
      
      const isAdminRole = !adminError && !!adminData;
      const isCanvasserRole = !canvasserError && !!canvasserData;
      
      console.log('Role check results:', { isAdminRole, isCanvasserRole, adminData, canvasserData });
      
      return { isAdmin: isAdminRole, isCanvasser: isCanvasserRole };
    } catch (error) {
      console.error('Error checking user role:', error);
      return { isAdmin: false, isCanvasser: false };
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      console.log('Refreshing session...');
      setIsLoading(true);
      setError(null);
      
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        setError('Session expired. Please sign in again.');
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setIsCanvasser(false);
        return;
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
        
        const { isAdmin: adminRole, isCanvasser: canvasserRole } = await checkUserRole(session.user.id, session.user.email);
        setIsAdmin(adminRole);
        setIsCanvasser(canvasserRole);
        setError(null);
        
        console.log('Session refreshed successfully');
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      setError('Failed to refresh session');
    } finally {
      setIsLoading(false);
    }
  }, [checkUserRole]);

  useEffect(() => {
    let mounted = true;
    let initializationTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        setIsLoading(true);
        setError(null);
        
        // Set a maximum initialization time
        initializationTimeout = setTimeout(() => {
          if (mounted) {
            console.log('Auth initialization timeout, setting loading to false');
            setIsLoading(false);
            setError('Authentication initialization timeout');
          }
        }, 15000);
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setError('Failed to load session');
            setIsLoading(false);
          }
          return;
        }
        
        if (session && mounted) {
          console.log('Initial session found:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          try {
            const { isAdmin: adminRole, isCanvasser: canvasserRole } = await checkUserRole(session.user.id, session.user.email);
            if (mounted) {
              setIsAdmin(adminRole);
              setIsCanvasser(canvasserRole);
              setError(null);
              console.log('Role assignment complete:', { adminRole, canvasserRole });
            }
          } catch (roleError) {
            console.error('Role check failed during initialization:', roleError);
            if (mounted) {
              setIsAdmin(false);
              setIsCanvasser(false);
              setError('Failed to determine user role');
            }
          }
        } else {
          console.log('No initial session found');
          if (mounted) {
            setIsAdmin(false);
            setIsCanvasser(false);
          }
        }
        
        if (mounted) {
          clearTimeout(initializationTimeout);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError('Failed to initialize authentication');
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        // Don't show loading for token refresh events
        if (event !== 'TOKEN_REFRESHED') {
          setIsLoading(true);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { isAdmin: adminRole, isCanvasser: canvasserRole } = await checkUserRole(session.user.id, session.user.email);
            if (mounted) {
              setIsAdmin(adminRole);
              setIsCanvasser(canvasserRole);
              setError(null);
              console.log('Auth state change role assignment:', { adminRole, canvasserRole });
            }
          } catch (error) {
            console.error('Failed to check role after auth change:', error);
            if (mounted) {
              setIsAdmin(false);
              setIsCanvasser(false);
              setError('Failed to determine user role');
            }
          }
        } else {
          if (mounted) {
            setIsAdmin(false);
            setIsCanvasser(false);
            setError(null);
          }
        }
        
        if (mounted && event !== 'TOKEN_REFRESHED') {
          setIsLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
      subscription.unsubscribe();
    };
  }, [checkUserRole]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting sign in for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        return { error };
      }
      
      console.log('Sign in successful');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      const authError = error as AuthError;
      setError(authError.message);
      return { error: authError };
    } finally {
      // Don't set loading to false here - let the auth state change handle it
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Signing out...');
      
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsCanvasser(false);
      setError(null);
      
      console.log('Sign out successful');
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even if signOut fails
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsCanvasser(false);
      setError('Failed to sign out properly');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    session,
    signIn,
    signOut,
    refreshSession,
    isAdmin,
    isCanvasser,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
