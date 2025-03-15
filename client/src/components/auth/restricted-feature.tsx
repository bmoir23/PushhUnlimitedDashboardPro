import { ReactNode } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { UserRole } from "@/lib/auth/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LockKeyhole } from "lucide-react";

interface RestrictedFeatureProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requiredPlan?: string;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function RestrictedFeature({
  children,
  requiredRoles = [],
  requiredPlan,
  fallback,
  showUpgrade = true,
}: RestrictedFeatureProps) {
  const { hasRole, hasPlan, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // If still loading auth state, don't render anything
  if (isLoading) {
    return null;
  }

  // Check if user has required role
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some(role => hasRole(role));
  
  // Check if user has required plan
  const hasRequiredPlan = !requiredPlan || hasPlan(requiredPlan);
  
  // If user has access, render the children
  if (hasRequiredRole && hasRequiredPlan) {
    return <>{children}</>;
  }
  
  // If fallback is provided, render that
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Otherwise render a default locked message with upgrade button
  return (
    <div className="border rounded-md p-6 text-center bg-muted/30">
      <div className="bg-primary/10 mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-4">
        <LockKeyhole className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">Feature Restricted</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
        {requiredPlan 
          ? `This feature is available on the ${requiredPlan} plan or higher.` 
          : "You don't have permission to access this feature."}
      </p>
      {showUpgrade && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/upgrade")}
        >
          View Plans
        </Button>
      )}
    </div>
  );
}