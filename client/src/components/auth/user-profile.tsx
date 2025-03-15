import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

export function UserProfile() {
  const { user, logout, hasPlan } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-between w-full">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth">Login</Link>
        </Button>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
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

  const initials = user.name ? getInitials(user.name) : 'U';
  
  // Determine user plan display
  let planDisplay = "Free Plan";
  if (user.user_metadata?.plan === "basic") planDisplay = "Basic Plan";
  if (user.user_metadata?.plan === "premium") planDisplay = "Premium Plan";
  if (user.user_metadata?.plan === "enterprise") planDisplay = "Enterprise Plan";

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`} alt={user.name || user.email || 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{user.name || user.email}</p>
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
        
        {user.user_metadata?.roles?.includes('admin') && (
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
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </Button>
      </div>
    </div>
  );
}