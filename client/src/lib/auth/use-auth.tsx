import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

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

// Custom auth hook that extends Auth0's useAuth0 hook
export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userPlan, setUserPlan] = useState<string | undefined>(undefined);
  const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Fetch user metadata and roles when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoadingUserData(true);
      
      // Get user metadata and roles from Auth0
      const getUserData = async () => {
        try {
          // Here we would typically make an API call to fetch detailed user data
          // For now, we'll extract roles from the user object if available
          const metadata = user.user_metadata as UserMetadata || {};
          const roles = metadata.roles || [];
          const plan = metadata.plan;
          
          setUserRoles(roles);
          setUserPlan(plan);
          setExtendedUser({
            ...user,
            user_metadata: {
              plan,
              roles
            }
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoadingUserData(false);
        }
      };

      getUserData();
    }
  }, [isAuthenticated, user]);

  // Check if user has a specific role
  const hasRole = (role: UserRole) => {
    return userRoles.includes(role);
  };

  // Check if user is on a specific plan
  const hasPlan = (plan: string) => {
    return userPlan === plan;
  };

  // Check if user is a super admin
  const isSuperAdmin = () => {
    return hasRole("superadmin");
  };

  // Check if user is an admin
  const isAdmin = () => {
    return hasRole("admin") || isSuperAdmin();
  };

  // Check if user has access to paid features
  const hasPaidAccess = () => {
    return userPlan && ["basic", "premium", "enterprise"].includes(userPlan);
  };

  return {
    isAuthenticated,
    isLoading: isLoading || isLoadingUserData,
    user: extendedUser,
    userRoles,
    userPlan,
    loginWithRedirect,
    logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
    getAccessTokenSilently,
    hasRole,
    hasPlan,
    isSuperAdmin,
    isAdmin,
    hasPaidAccess
  };
}