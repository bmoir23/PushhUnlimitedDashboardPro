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
      <Sidebar currentPath={location} />
      <main className="flex-1 min-w-0 overflow-auto bg-slate-50">
        <TopBar />
        <div className="px-4 sm:px-6 py-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
