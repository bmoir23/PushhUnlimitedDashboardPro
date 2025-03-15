import { createContext, useContext, useState, ReactNode } from "react";

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
  isLoading: false,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userPlan, setUserPlan] = useState<string | undefined>(undefined);

  // Mock login function (replace with actual Auth0 login)
  const loginWithRedirect = async (options?: any) => {
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setUser({
        name: "Demo User",
        email: "demo@example.com",
        picture: "",
        user_metadata: {
          roles: ["admin"],
          plan: "premium"
        }
      });
      setUserRoles(["admin"]);
      setUserPlan("premium");
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  // Mock logout function
  const logout = async () => {
    setUser(null);
    setUserRoles([]);
    setUserPlan(undefined);
    setIsAuthenticated(false);
  };

  // Mock token function
  const getAccessTokenSilently = async () => {
    return "mock-token";
  };

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
    user,
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
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "user" | "admin" | "superadmin";

interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasPlan: (plan: string) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user");
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    
    // Superadmin has access to everything
    if (user.role === "superadmin") return true;
    
    // Admin has access to admin and user roles
    if (user.role === "admin" && (role === "admin" || role === "user")) return true;
    
    // Regular user only has user role
    return user.role === role;
  };

  const hasPlan = (plan: string) => {
    if (!user) return false;
    return user.plan === plan;
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      hasRole, 
      hasPlan,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
