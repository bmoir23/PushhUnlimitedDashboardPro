import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useToast } from "./use-toast";

// Define user role types
export type UserRole = "free" | "basic" | "premium" | "enterprise" | "admin" | "superadmin";

// Interface for user metadata that includes plan and role information
export interface UserMetadata {
  plan?: string;
  roles?: UserRole[];
}

// Extended user interface that includes metadata
export interface ExtendedUser {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  user_metadata?: UserMetadata;
  [key: string]: any;
}

// Create the auth context with default values
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ExtendedUser | null;
  userRoles: UserRole[];
  userPlan: string | undefined;
  loginWithRedirect: (options?: any) => Promise<void>;
  logout: () => Promise<void>;
  getAccessTokenSilently: () => Promise<string>;
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
  loginWithRedirect: async () => { 
    console.log("Auth not initialized: loginWithRedirect");
  },
  logout: async () => { 
    console.log("Auth not initialized: logout");
  },
  getAccessTokenSilently: async () => {
    console.log("Auth not initialized: getAccessTokenSilently");
    return "";
  },
  hasRole: () => false,
  hasPlan: () => false,
  isSuperAdmin: () => false,
  isAdmin: () => false,
  hasPaidAccess: () => false
});

// Provider component that wraps the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userPlan, setUserPlan] = useState<string | undefined>(undefined);
  
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    error
  } = useAuth0();

  // Handle auth errors and debugging
  useEffect(() => {
    if (error) {
      console.error("Auth0 Error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Log authentication status for debugging
  useEffect(() => {
    console.log("Auth Status:", { 
      isAuthenticated, 
      isLoading, 
      userAvailable: !!user 
    });
  }, [isAuthenticated, isLoading, user]);

  // Extract user roles and plan from metadata when user changes
  useEffect(() => {
    if (user && user.user_metadata) {
      // Extract roles
      const roles = user.user_metadata.roles || [];
      setUserRoles(roles as UserRole[]);
      
      // Extract plan
      const plan = user.user_metadata.plan;
      setUserPlan(plan);
    } else {
      setUserRoles([]);
      setUserPlan(undefined);
    }
  }, [user]);

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
    isAuthenticated,
    isLoading,
    user: user as ExtendedUser | null,
    userRoles,
    userPlan,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
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