import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

interface Session {
  access_token: string;
  user: User;
  expires_at?: number;
}

export const useAuth = () => {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();

  // Convert Clerk user to our User format
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    full_name: clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser.firstName || clerkUser.lastName || undefined,
    avatar_url: clerkUser.imageUrl || undefined,
    created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
  } : null;

  // Create a session-like object for compatibility
  const session: Session | null = user ? {
    access_token: '', // Clerk handles tokens internally
    user: user,
    expires_at: undefined,
  } : null;

  const signOut = async () => {
    await clerkSignOut();
    return { error: null };
  };

  const refreshUser = async () => {
    // Clerk automatically refreshes user data
    // This is here for compatibility
    return;
  };

  // Legacy methods - no longer used with Clerk but kept for compatibility
  const signUp = async () => {
    return { error: { message: "Use Clerk authentication UI" } };
  };

  const signIn = async () => {
    return { error: { message: "Use Clerk authentication UI" } };
  };

  return {
    user,
    session,
    loading: !userLoaded,
    signUp,
    signIn,
    signOut,
    refreshUser
  };
};
