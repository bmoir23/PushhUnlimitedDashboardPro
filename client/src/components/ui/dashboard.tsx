import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopBar } from "@/components/ui/top-bar";
import { useLocation } from "wouter";

interface DashboardProps {
  children: ReactNode;
}

export function Dashboard({ children }: DashboardProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar is now fixed in position for md screens and above */}
      <div className="md:fixed md:inset-y-0 md:left-0 md:w-64 md:z-10">
        <Sidebar currentPath={location} />
      </div>
      
      {/* Main content with padding to account for the fixed sidebar */}
      <main className="flex-1 min-w-0 bg-slate-50 md:ml-64 flex flex-col h-screen">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
