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
  LogOut,
  PlusCircle,
  ExternalLink
} from "lucide-react";

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
}

function NavItem({ 
  href, 
  icon, 
  children, 
  isActive = false,
  isDisabled = false,
  isDemoActive = false
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
      <a className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
        isActive 
          ? "bg-primary text-white" 
          : "text-slate-700 hover:bg-slate-100"
      )}>
        {icon}
        {children}
        {isDemoActive && (
          <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Active
          </span>
        )}
      </a>
    </Link>
  );
}

export function Sidebar({ currentPath }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-auto md:h-screen md:sticky md:top-0">
      {/* Logo */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-xl font-bold">DashNex</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        <NavItem 
          href="/" 
          icon={<Home className="mr-3 h-5 w-5" />}
          isActive={isActivePage(currentPath, '/')}
        >
          Home
        </NavItem>

        <NavItem 
          href="#" 
          icon={<FileText className="mr-3 h-5 w-5" />}
          isDisabled={true}
        >
          Projects / Campaigns
        </NavItem>

        <NavItem 
          href="#" 
          icon={<FilePlus className="mr-3 h-5 w-5" />}
          isDisabled={true}
        >
          Project Creation
        </NavItem>

        <NavItem 
          href="/nexus" 
          icon={<Monitor className="mr-3 h-5 w-5 text-primary" />}
          isActive={isActivePage(currentPath, '/nexus')}
          isDemoActive={isDemoPage('/nexus')}
        >
          Nexus
        </NavItem>

        <NavItem 
          href="/one-click-tools" 
          icon={<PlusCircle className="mr-3 h-5 w-5 text-primary" />}
          isActive={isActivePage(currentPath, '/one-click-tools')}
          isDemoActive={isDemoPage('/one-click-tools')}
        >
          One-Click Tools
        </NavItem>

        <NavItem 
          href="#" 
          icon={<BarChart2 className="mr-3 h-5 w-5" />}
          isDisabled={true}
        >
          Analytics & Monitoring
        </NavItem>

        <NavItem 
          href="#" 
          icon={<Grid className="mr-3 h-5 w-5" />}
          isDisabled={true}
        >
          Integrations
        </NavItem>

        <NavItem 
          href="#" 
          icon={<User className="mr-3 h-5 w-5" />}
          isDisabled={true}
        >
          Profile
        </NavItem>

        <NavItem 
          href="#" 
          icon={<Settings className="mr-3 h-5 w-5" />}
          isDisabled={true}
        >
          Admin Panel
        </NavItem>
      </nav>

      {/* Documentation Links */}
      <div className="p-4 border-t border-slate-200">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Documentation</h3>
        <div className="space-y-1">
          <Link href="#">
            <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100">
              <ExternalLink className="mr-3 h-5 w-5 text-slate-500" />
              API Documentation
            </a>
          </Link>
          <Link href="#">
            <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100">
              <BookOpen className="mr-3 h-5 w-5 text-slate-500" />
              User Guide
            </a>
          </Link>
        </div>
      </div>

      {/* User Account */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img 
              className="h-10 w-10 rounded-full" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" 
              alt="User avatar"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-700">Sarah Johnson</p>
            <p className="text-xs text-slate-500">Enterprise Plan</p>
          </div>
          <button className="ml-auto text-slate-500 hover:text-slate-600">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
