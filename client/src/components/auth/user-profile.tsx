import { useAuth } from "@/lib/auth/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, UserCog, ChevronRight, Crown } from "lucide-react";
import { useLocation } from "wouter";

export function UserProfile() {
  const { user, isLoading, logout, userRoles, userPlan, isSuperAdmin } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Signed In</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to display role with proper capitalization
  const formatRole = (role: string) => {
    if (role === "superadmin") return "Super Admin";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Function to get color for plan badge
  const getPlanColor = () => {
    switch (userPlan) {
      case "basic":
        return "secondary";
      case "premium":
        return "default";
      case "enterprise":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Your Profile</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Plan</h4>
            <div className="flex items-center">
              <Badge variant={getPlanColor() as any} className="capitalize">
                {userPlan || "Free"}
              </Badge>
              {(userPlan && userPlan !== "free") && (
                <Crown className="h-4 w-4 text-yellow-500 ml-2" />
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Role</h4>
            <div className="flex flex-wrap gap-1">
              {userRoles.length > 0 ? (
                userRoles.map((role) => (
                  <Badge key={role} variant="outline" className="capitalize">
                    {formatRole(role)}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">User</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {isSuperAdmin() && (
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => navigate("/admin/user-management")}
          >
            <div className="flex items-center">
              <UserCog className="h-4 w-4 mr-2" />
              Admin Dashboard
            </div>
            <ChevronRight className="h-4 w-4 opacity-50" />
          </Button>
        )}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}