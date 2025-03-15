import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  requiredRoles?: string[];
  requiredPlan?: string;
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredRoles,
  requiredPlan,
}: ProtectedRouteProps) {
  const { user, isLoading, hasRole, hasPlan } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check for required roles
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return (
        <Route path={path}>
          <Redirect to="/unauthorized" />
        </Route>
      );
    }
  }

  // Check for required plan
  if (requiredPlan && !hasPlan(requiredPlan)) {
    return (
      <Route path={path}>
        <Redirect to="/upgrade" />
      </Route>
    );
  }

  // If all checks pass, render the component
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}