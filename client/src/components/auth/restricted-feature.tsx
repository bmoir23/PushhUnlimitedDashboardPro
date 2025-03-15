import { ReactNode } from 'react';
import { useAuth, UserRole } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface RestrictedFeatureProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requiredPlan?: string;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function RestrictedFeature({
  children,
  requiredRoles,
  requiredPlan,
  fallback,
  showUpgrade = true,
}: RestrictedFeatureProps) {
  const { user, hasRole, hasPlan } = useAuth();

  // If not authenticated, show fallback or default message
  if (!user) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <RestrictedFeatureFallback 
        message="Please log in to access this feature" 
        showUpgrade={false} 
      />
    );
  }

  // Check for required roles
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return fallback ? (
        <>{fallback}</>
      ) : (
        <RestrictedFeatureFallback 
          message="You don't have permission to access this feature" 
          showUpgrade={showUpgrade} 
        />
      );
    }
  }

  // Check for required plan
  if (requiredPlan && !hasPlan(requiredPlan)) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <RestrictedFeatureFallback 
        message={`This feature requires ${requiredPlan} plan or higher`} 
        showUpgrade={showUpgrade} 
      />
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
}

function RestrictedFeatureFallback({
  message,
  showUpgrade,
}: {
  message: string;
  showUpgrade: boolean;
}) {
  return (
    <div className="flex flex-col items-center p-6 space-y-4 text-center border rounded-lg bg-background/50">
      <p className="text-sm text-muted-foreground">{message}</p>
      {showUpgrade && (
        <Button variant="outline" size="sm" asChild>
          <Link href="/upgrade">Upgrade Plan</Link>
        </Button>
      )}
    </div>
  );
}