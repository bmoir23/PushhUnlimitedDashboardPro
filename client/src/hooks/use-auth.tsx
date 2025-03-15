import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";
import { Session, User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Define user role types
export type UserRole = "free" | "basic" | "premium" | "enterprise" | "admin" | "superadmin";

// Interface for user metadata that includes plan and role information
export interface UserMetadata {
  plan?: string;
  roles?: UserRole[];
  name?: string;
  picture?: string;
}

// Extended user interface that includes metadata
export interface ExtendedUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  roles?: UserRole[];
  plan?: string;
  [key: string]: any;
}

// Create the auth context with default values
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ExtendedUser | null;
  userRoles: UserRole[];
  userPlan: string | undefined;
  loginWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, metadata?: UserMetadata) => Promise<{ error: Error | null }>;
  loginWithGoogle: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  hasRole: (role: UserRole) => boolean;
  hasPlan: (plan: string) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  hasPaidAccess: () => boolean;
}

// Create a context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  userRoles: [],
  userPlan: undefined,
  loginWithEmail: async () => ({ error: new Error("Auth not initialized") }),
  signUpWithEmail: async () => ({ error: new Error("Auth not initialized") }),
  loginWithGoogle: async () => { console.log("Auth not initialized: loginWithGoogle"); },
  loginWithLinkedIn: async () => { console.log("Auth not initialized: loginWithLinkedIn"); },
  logout: async () => { console.log("Auth not initialized: logout"); },
  getToken: async () => { console.log("Auth not initialized: getToken"); return null; },
  hasRole: () => false,
  hasPlan: () => false,
  isSuperAdmin: () => false,
  isAdmin: () => false,
  hasPaidAccess: () => false
});

// Provider component that wraps the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user profile from database when logged in
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      // First check if the user exists in your database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();
      
      if (error) {
        // User doesn't exist yet, create a profile
        if (error.code === 'PGRST116') {
          // Create a new user profile
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              auth_id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.name || session.user.email,
              picture: session.user.user_metadata.picture || null,
              roles: ['free'],
              plan: 'free',
              status: 'active',
              metadata: {},
            })
            .select()
            .single();
            
          if (createError) {
            toast({
              title: "Error creating user profile",
              description: createError.message,
              variant: "destructive",
            });
            return null;
          }
          
          return newUser;
        }
        
        toast({
          title: "Error fetching user profile",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user.id,
  });
  
  // Check if user is authenticated
  useEffect(() => {
    // Set up initial session
    setIsLoading(true);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
      
      // Invalidate profile query when auth state changes
      if (session) {
        queryClient.invalidateQueries({ queryKey: ["userProfile", session.user.id] });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Authentication methods
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: UserMetadata) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {
            name: email,
            roles: ['free'],
            plan: 'free'
          }
        }
      });
      
      if (error) throw error;
      toast({
        title: "Sign Up Successful",
        description: "Please check your email for a verification link.",
      });
      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign Up Error",
        description: error instanceof Error ? error.message : "An error occurred during sign up",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth'
        }
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An error occurred during Google login",
        variant: "destructive",
      });
    }
  };

  const loginWithLinkedIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: window.location.origin + '/auth'
        }
      });
    } catch (error) {
      console.error("LinkedIn login error:", error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An error occurred during LinkedIn login",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: error instanceof Error ? error.message : "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const getToken = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token || null;
    } catch (error) {
      console.error("Get token error:", error);
      return null;
    }
  };

  // Create a combined user object from auth and profile data
  const user: ExtendedUser | null = session && userProfile ? {
    id: session.user.id,
    email: session.user.email || userProfile.email,
    name: userProfile.name || session.user.user_metadata.name,
    picture: userProfile.picture || session.user.user_metadata.picture,
    roles: userProfile.roles || ['free'],
    plan: userProfile.plan || 'free',
    ...userProfile
  } : null;

  // Extract user roles and plan
  const userRoles = user?.roles || [];
  const userPlan = user?.plan;

  // Utility functions
  const hasRole = (role: UserRole) => {
    return userRoles.includes(role);
  };

  const hasPlan = (plan: string) => {
    return userPlan === plan;
  };

  const isSuperAdmin = () => {
    return hasRole("superadmin");
  };

  const isAdmin = () => {
    return hasRole("admin") || isSuperAdmin();
  };

  const hasPaidAccess = () => {
    return Boolean(userPlan && ["basic", "premium", "enterprise"].includes(userPlan));
  };

  // Provide the auth context value
  const contextValue = {
    isAuthenticated: !!session,
    isLoading: isLoading || isProfileLoading,
    user,
    userRoles,
    userPlan,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    loginWithLinkedIn,
    logout,
    getToken,
    hasRole,
    hasPlan,
    isSuperAdmin,
    isAdmin,
    hasPaidAccess
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}