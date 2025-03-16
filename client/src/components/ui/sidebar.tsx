
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn, isActivePage } from "@/lib/utils";
import {
  Home,
  FileText,
  FilePlus,
  Monitor,
  BarChart2,
  Grid,
  User,
  Settings,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "./button";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  isDemoActive?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

interface SidebarProps {
  currentPath: string;
}

function NavItem({ 
  href, 
  icon, 
  children, 
  isActive = false,
  isDisabled = false,
  isDemoActive = false,
  onClick,
  collapsed = false
}: NavItemProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  if (isDisabled) {
    return (
      <div className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 cursor-not-allowed",
        collapsed && "justify-center px-2"
      )}>
        {icon}
        {!collapsed && (
          <>
            <span className="ml-3">{children}</span>
            <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-slate-200 text-slate-500">
              Demo
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <Link href={href}>
      <div 
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
          isActive 
            ? "bg-primary text-white" 
            : isDarkMode 
              ? "text-slate-300 hover:bg-slate-700" 
              : "text-slate-700 hover:bg-slate-100",
          collapsed && "justify-center px-2"
        )}
        onClick={onClick}
      >
        {icon}
        {!collapsed && (
          <>
            <span className="ml-3">{children}</span>
            {isDemoActive && (
              <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Active
              </span>
            )}
          </>
        )}
      </div>
    </Link>
  );
}

export function Sidebar({ currentPath }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Close mobile menu on location change
  const [location] = useLocation();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const sidebarClass = cn(
    "h-screen flex flex-col transition-all duration-300 border-r z-40 fixed top-0 left-0",
    isDarkMode ? "bg-sidebar text-sidebar-foreground border-slate-700" : "bg-white text-slate-900 border-slate-200",
    collapsed ? "w-16" : "w-64",
    mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  const hamburgerButton = (
    <Button 
      variant="ghost" 
      size="icon" 
      className={cn(
        "md:hidden fixed top-4 left-4 z-50",
        isDarkMode ? "text-white" : "text-slate-900"
      )}
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );

  const overlayClass = cn(
    "fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity",
    mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  );

  return (
    <>
      {hamburgerButton}
      <div className={overlayClass} onClick={() => setMobileMenuOpen(false)} />
      
      <aside className={sidebarClass}>
        <div className={cn(
          "flex items-center h-16 px-4 border-b",
          isDarkMode ? "border-slate-700" : "border-slate-200"
        )}>
          {!collapsed ? (
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-xl">YourApp</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleCollapsed}
                className={isDarkMode ? "text-white" : "text-slate-900"}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCollapsed}
              className="mx-auto"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem 
            href="/" 
            icon={<Home className="h-5 w-5" />} 
            isActive={isActivePage(currentPath, "/")}
            collapsed={collapsed}
          >
            Dashboard
          </NavItem>
          <NavItem 
            href="/profile" 
            icon={<User className="h-5 w-5" />} 
            isActive={isActivePage(currentPath, "/profile")}
            collapsed={collapsed}
          >
            Profile
          </NavItem>
          <NavItem 
            href="/projects" 
            icon={<FileText className="h-5 w-5" />} 
            isActive={isActivePage(currentPath, "/projects")}
            collapsed={collapsed}
          >
            Projects
          </NavItem>
          <NavItem 
            href="/analytics" 
            icon={<BarChart2 className="h-5 w-5" />} 
            isActive={isActivePage(currentPath, "/analytics")}
            collapsed={collapsed}
          >
            Analytics
          </NavItem>
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            isActive={isActivePage(currentPath, "/settings")}
            collapsed={collapsed}
          >
            Settings
          </NavItem>
        </nav>
        
        {!collapsed && (
          <div className={cn(
            "p-4 border-t",
            isDarkMode ? "border-slate-700" : "border-slate-200"
          )}>
            <UserProfile minimal />
          </div>
        )}
      </aside>
      
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "md:ml-16" : "md:ml-64"
      )}>
        {/* Main content will be here */}
      </div>
    </>
  );
}
