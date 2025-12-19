import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

interface Session {
  access_token: string;
  user: User;
  expires_at?: number;
}

// Helper to check if Supabase is available
const isSupabaseAvailable = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key');
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (isSupabaseAvailable()) {
        try {
          // Get current session from Supabase
          const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (supabaseSession?.user) {
            const userData: User = {
              id: supabaseSession.user.id,
              email: supabaseSession.user.email || '',
              full_name: supabaseSession.user.user_metadata?.full_name,
              created_at: supabaseSession.user.created_at,
            };
            setUser(userData);
            setSession({
              access_token: supabaseSession.access_token,
              user: userData,
              expires_at: supabaseSession.expires_at,
            });
          }
        } catch (error) {
          console.error('Error checking session:', error);
        }
      } else {
        // Fallback to localStorage
        const userStr = localStorage.getItem('local-auth-user');
        const sessionStr = localStorage.getItem('local-auth-session');

        if (userStr && sessionStr) {
          try {
            const savedUser = JSON.parse(userStr);
            const savedSession = JSON.parse(sessionStr);

            if (savedSession.expires_at && savedSession.expires_at > Date.now() / 1000) {
              setUser(savedUser);
              setSession(savedSession);
            } else {
              localStorage.removeItem('local-auth-user');
              localStorage.removeItem('local-auth-session');
            }
          } catch (e) {
            console.error("Error parsing auth data:", e);
            localStorage.removeItem('local-auth-user');
            localStorage.removeItem('local-auth-session');
          }
        }
      }

      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    if (isSupabaseAvailable()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
            created_at: session.user.created_at,
          };
          setUser(userData);
          setSession({
            access_token: session.access_token,
            user: userData,
            expires_at: session.expires_at,
          });
        } else {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: fullName,
            created_at: data.user.created_at,
          };
          setUser(userData);
          // Session will be set by the auth state change listener
        }

        return { error: null };
      } catch (error) {
        console.error('Sign up error:', error);
        const errorMessage = error instanceof Error ? error.message : "Failed to create account";
        return {
          error: { message: errorMessage },
        };
      }
    }

    // Fallback to localStorage
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.trim().toLowerCase(),
      full_name: fullName,
      created_at: new Date().toISOString(),
    };

    const newSession: Session = {
      access_token: crypto.randomUUID(),
      user: newUser,
      expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30,
    };

    localStorage.setItem('local-auth-user', JSON.stringify(newUser));
    localStorage.setItem('local-auth-session', JSON.stringify(newSession));

    setUser(newUser);
    setSession(newSession);

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password,
        });

        if (error) throw error;

        if (data.user && data.session) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name,
            created_at: data.user.created_at,
          };
          setUser(userData);
          setSession({
            access_token: data.session.access_token,
            user: userData,
            expires_at: data.session.expires_at,
          });
        }

        return { error: null };
      } catch (error) {
        console.error('Sign in error:', error);
        const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
        return {
          error: { message: errorMessage },
        };
      }
    }

    // Fallback to localStorage with hardcoded credentials
    const trimmedEmail = email.trim().toLowerCase();
    const correctEmail = "tafsinahmed80p@gmail.com";
    const correctPassword = "Mohim@663299";

    if (trimmedEmail === correctEmail && password === correctPassword) {
      const user: User = {
        id: crypto.randomUUID(),
        email: correctEmail,
        full_name: "Tafsin Ahmed",
        created_at: new Date().toISOString(),
      };

      const newSession: Session = {
        access_token: crypto.randomUUID(),
        user: user,
        expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30,
      };

      localStorage.setItem('local-auth-user', JSON.stringify(user));
      localStorage.setItem('local-auth-session', JSON.stringify(newSession));

      setUser(user);
      setSession(newSession);

      return { error: null };
    } else {
      return {
        error: {
          message: "Invalid email or password"
        } as { message: string }
      };
    }
  };

  const signOut = async () => {
    if (isSupabaseAvailable()) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }

    // Clear localStorage
    localStorage.removeItem('local-auth-user');
    localStorage.removeItem('local-auth-session');
    setUser(null);
    setSession(null);

    return { error: null };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
};
