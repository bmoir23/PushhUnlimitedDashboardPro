import { Link } from "wouter";
import { cn, isActivePage, isDemoPage } from "@/lib/utils";
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
  PlusCircle,
  ExternalLink,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { UserProfile } from "@/components/auth/user-profile";

interface SidebarProps {
  currentPath: string;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  isDemoActive?: boolean;
  onClick?: () => void;
}

function NavItem({ 
  href, 
  icon, 
  children, 
  isActive = false,
  isDisabled = false,
  isDemoActive = false,
  onClick
}: NavItemProps) {
  if (isDisabled) {
    return (
      <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 cursor-not-allowed">
        {icon}
        {children}
        <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-slate-200 text-slate-500">
          Demo
        </span>
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
            : "text-slate-700 hover:bg-slate-100"
        )}
        onClick={onClick}
      >
        {icon}
        {children}
        {isDemoActive && (
          <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Active
          </span>
        )}
      </div>
    </Link>
  );
}

export function Sidebar({ currentPath }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Mobile menu toggle button that appears in the top bar
  const MobileMenuToggle = () => (
    <button 
      onClick={toggleMobileMenu} 
      className="fixed top-4 right-4 z-50 md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
      aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
    >
      {mobileMenuOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </button>
  );

  return (
    <>
      <MobileMenuToggle />
      
      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} 
        onClick={closeMobileMenu}
      />
      
      <aside 
        className={cn(
          "w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-full md:h-screen",
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:transform-none md:relative",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-xl font-bold">Pushh Platform</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem 
            href="/" 
            icon={<Home className="mr-3 h-5 w-5" />}
            isActive={isActivePage(currentPath, '/')}
            onClick={closeMobileMenu}
          >
            Home
          </NavItem>

          <NavItem 
            href="#" 
            icon={<FileText className="mr-3 h-5 w-5" />}
            isDisabled={true}
            onClick={closeMobileMenu}
          >
            Projects / Campaigns
          </NavItem>

          <NavItem 
            href="#" 
            icon={<FilePlus className="mr-3 h-5 w-5" />}
            isDisabled={true}
            onClick={closeMobileMenu}
          >
            Project Creation
          </NavItem>

          <NavItem 
            href="/nexus" 
            icon={<Monitor className="mr-3 h-5 w-5 text-primary" />}
            isActive={isActivePage(currentPath, '/nexus')}
            isDemoActive={isDemoPage('/nexus')}
            onClick={closeMobileMenu}
          >
            Nexus
          </NavItem>

          <NavItem 
            href="/one-click-tools" 
            icon={<PlusCircle className="mr-3 h-5 w-5 text-primary" />}
            isActive={isActivePage(currentPath, '/one-click-tools')}
            isDemoActive={isDemoPage('/one-click-tools')}
            onClick={closeMobileMenu}
          >
            One-Click Tools
          </NavItem>

          <NavItem 
            href="#" 
            icon={<BarChart2 className="mr-3 h-5 w-5" />}
            isDisabled={true}
            onClick={closeMobileMenu}
          >
            Analytics & Monitoring
          </NavItem>

          <NavItem 
            href="#" 
            icon={<Grid className="mr-3 h-5 w-5" />}
            isDisabled={true}
            onClick={closeMobileMenu}
          >
            Integrations
          </NavItem>

          <NavItem 
            href="#" 
            icon={<User className="mr-3 h-5 w-5" />}
            isDisabled={true}
            onClick={closeMobileMenu}
          >
            Profile
          </NavItem>

          <NavItem 
            href="#" 
            icon={<Settings className="mr-3 h-5 w-5" />}
            isDisabled={true}
            onClick={closeMobileMenu}
          >
            Admin Panel
          </NavItem>
        </nav>

        {/* Documentation Links */}
        <div className="p-4 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Documentation</h3>
          <div className="space-y-1">
            <Link href="#">
              <div 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer"
                onClick={closeMobileMenu}
              >
                <ExternalLink className="mr-3 h-5 w-5 text-slate-500" />
                API Documentation
              </div>
            </Link>
            <Link href="#">
              <div 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer"
                onClick={closeMobileMenu}
              >
                <BookOpen className="mr-3 h-5 w-5 text-slate-500" />
                User Guide
              </div>
            </Link>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200">
          <UserProfile />
          <div className="mt-2 text-xs text-center text-slate-500">
            Powered by Pushh Unlimited
          </div>
        </div>
      </aside>
    </>
  );
}
