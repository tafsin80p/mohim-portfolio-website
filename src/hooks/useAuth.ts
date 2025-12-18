import { useState, useEffect } from "react";

interface LocalUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

interface LocalSession {
  access_token: string;
  user: LocalUser;
  expires_at: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth in localStorage
    const userStr = localStorage.getItem('local-auth-user');
    const sessionStr = localStorage.getItem('local-auth-session');
    
    if (userStr && sessionStr) {
      try {
        const savedUser = JSON.parse(userStr);
        const savedSession = JSON.parse(sessionStr);

        // Check if session is expired
        if (savedSession.expires_at && savedSession.expires_at > Date.now() / 1000) {
          setUser(savedUser);
          setSession(savedSession);
        } else {
          // Session expired, clear it
          localStorage.removeItem('local-auth-user');
          localStorage.removeItem('local-auth-session');
        }
      } catch (e) {
        console.error("Error parsing auth data:", e);
        localStorage.removeItem('local-auth-user');
        localStorage.removeItem('local-auth-session');
      }
    }
    
      setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Store user data in localStorage
    const newUser: LocalUser = {
      id: "user-" + Date.now(),
      email: email.trim().toLowerCase(),
      full_name: fullName,
      created_at: new Date().toISOString(),
    };
    
    const newSession: LocalSession = {
      access_token: "local-token-" + Date.now(),
      user: newUser,
      expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30, // 30 days
    };
    
    localStorage.setItem('local-auth-user', JSON.stringify(newUser));
    localStorage.setItem('local-auth-session', JSON.stringify(newSession));
    
    setUser(newUser);
    setSession(newSession);
    
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Local authentication with hardcoded credentials
    const trimmedEmail = email.trim().toLowerCase();
    const correctEmail = "tafsinahmed80p@gmail.com";
    const correctPassword = "Mohim@663299";
    
    if (trimmedEmail === correctEmail && password === correctPassword) {
      // Create user object
      const user: LocalUser = {
        id: "user-" + Date.now(),
        email: correctEmail,
        full_name: "Tafsin Ahmed",
        created_at: new Date().toISOString(),
      };
      
      const session: LocalSession = {
        access_token: "local-token-" + Date.now(),
        user: user,
        expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30, // 30 days
      };
      
      // Store in localStorage
      localStorage.setItem('local-auth-user', JSON.stringify(user));
      localStorage.setItem('local-auth-session', JSON.stringify(session));
      
      // Update state
      setUser(user);
      setSession(session);
      
      return { error: null };
    } else {
      return { 
        error: { 
          message: "Invalid email or password" 
        } as any 
      };
    }
  };

  const signOut = async () => {
    // Clear localStorage auth
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
