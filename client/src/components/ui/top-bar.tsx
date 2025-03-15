import { Search, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/auth/user-profile";

export function TopBar() {
  return (
    <div className="sticky top-0 z-10 bg-background border-b px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center ml-4 md:ml-6 space-x-4">
          {/* Search */}
          <div className="relative rounded-md max-w-xs w-full hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10" 
              placeholder="Search..."
            />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
          </Button>
          
          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* User Profile Dropdown */}
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
