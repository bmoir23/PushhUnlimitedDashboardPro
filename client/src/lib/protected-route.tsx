import { Redirect, Route, RouteProps } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
  requiredRoles?: UserRole[];
  requiredPlan?: string;
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredRoles,
  requiredPlan,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasPlan } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        // Show loading state while checking authentication
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        // Check if user is authenticated
        if (!isAuthenticated) {
          return <Redirect to="/auth" />;
        }

        // Check role requirement if specified
        if (requiredRoles && requiredRoles.length > 0) {
          const hasRequiredRole = requiredRoles.some(role => hasRole(role));
          if (!hasRequiredRole) {
            return <Redirect to="/unauthorized" />;
          }
        }

        // Check plan requirement if specified
        if (requiredPlan && !hasPlan(requiredPlan)) {
          return <Redirect to="/upgrade" />;
        }

        // User meets all requirements, render the component
        return <Component params={params} />;
      }}
    </Route>
  );
}