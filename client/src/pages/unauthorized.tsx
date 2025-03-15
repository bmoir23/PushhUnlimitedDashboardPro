import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LockKeyhole } from "lucide-react";

export default function Unauthorized() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <LockKeyhole className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-3">Access Restricted</h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          You don't have permission to access this page. Please upgrade your plan or contact your administrator.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
          >
            Return to Dashboard
          </Button>
          
          <Button onClick={() => setLocation("/upgrade")}>
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
}