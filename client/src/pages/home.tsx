import { Dashboard } from "@/components/ui/dashboard";
import { OverviewCards } from "@/components/ui/overview-cards";
import { ProjectList } from "@/components/ui/project-list";
import { IntegrationList } from "@/components/ui/integration-list";
import { AnalyticsOverview } from "@/components/ui/analytics-overview";
import { DemoPages } from "@/components/ui/demo-pages";
import { 
  dashboardStats, 
  recentProjects, 
  connectedIntegrations 
} from "@/data/mock-data";

export default function Home() {
  return (
    <Dashboard>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-indigo-700 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Welcome back, Sarah!</h2>
            <p className="text-indigo-100">Your dashboard is 65% complete. Continue where you left off.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Resume Last Project
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <OverviewCards stats={dashboardStats} />

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectList projects={recentProjects} />
        <IntegrationList integrations={connectedIntegrations} />
      </div>

      {/* Demo Pages */}
      <DemoPages />

      {/* Analytics Overview */}
      <AnalyticsOverview />
    </Dashboard>
  );
}
