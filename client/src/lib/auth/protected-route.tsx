import { useAuth } from "./use-auth";
import { Redirect, Route } from "wouter";
import { UserRole } from "./use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: React.FC;
  requiredRoles?: UserRole[];
  requiredPlan?: string;
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredRoles = [],
  requiredPlan,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasPlan } = useAuth();

  // Handle loading state
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check required roles if specified
  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
    return (
      <Route path={path}>
        <Redirect to="/unauthorized" />
      </Route>
    );
  }

  // Check required plan if specified
  if (requiredPlan && !hasPlan(requiredPlan)) {
    return (
      <Route path={path}>
        <Redirect to="/upgrade" />
      </Route>
    );
  }

  // If all checks pass, render the component
  return <Route path={path} component={Component} />;
}