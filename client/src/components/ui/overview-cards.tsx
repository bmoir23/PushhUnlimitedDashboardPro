import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { 
  FolderPlus, 
  FileEdit, 
  Grid, 
  Code 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export function StatsCard({ title, value, icon, iconBgColor, iconColor }: StatsCardProps) {
  return (
    <Card className="shadow-sm border border-slate-200">
      <CardContent className="pt-6 px-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-slate-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  stats: {
    activeProjects: number;
    activeCampaigns: number;
    integrations: number;
    apiCalls: number;
  };
}

export function OverviewCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Active Projects"
        value={stats.activeProjects}
        icon={<FolderPlus className="h-6 w-6" />}
        iconBgColor="bg-indigo-100"
        iconColor="text-primary"
      />
      <StatsCard
        title="Active Campaigns"
        value={stats.activeCampaigns}
        icon={<FileEdit className="h-6 w-6" />}
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
      />
      <StatsCard
        title="Active Integrations"
        value={stats.integrations}
        icon={<Grid className="h-6 w-6" />}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
      <StatsCard
        title="API Calls (30d)"
        value={formatNumber(stats.apiCalls)}
        icon={<Code className="h-6 w-6" />}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
      />
    </div>
  );
}
