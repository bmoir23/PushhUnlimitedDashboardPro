import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { LogOut, Settings, User } from "lucide-react";

export function UserProfile() {
  const { user, logoutMutation, hasPlan } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-between w-full">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth">Login</Link>
        </Button>
      </div>
    );
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = user.username ? getInitials(user.username) : 'U';
  
  // Determine user plan display
  let planDisplay = "Free Plan";
  if (user.plan === "basic") planDisplay = "Basic Plan";
  if (user.plan === "premium") planDisplay = "Premium Plan";
  if (user.plan === "enterprise") planDisplay = "Enterprise Plan";

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{user.username}</p>
          <p className="text-xs text-slate-500">{planDisplay}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start" 
          asChild
        >
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </Button>
        
        {user.roles && user.roles.includes('admin') && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            asChild
          >
            <Link href="/admin/user-management" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </Button>
        )}
        
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full justify-start" 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
        </Button>
      </div>
    </div>
  );
}