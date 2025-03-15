import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BoxIcon, LayoutGrid, MessageSquare, FileBarChart } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  lastIntegrated: string;
  status: 'connected' | 'disconnected' | 'pending';
  icon: 'airtable' | 'zendesk' | 'intercom' | 'segment';
}

interface IntegrationListProps {
  integrations: Integration[];
}

const getIconComponent = (icon: Integration['icon']) => {
  switch (icon) {
    case 'airtable':
      return <BoxIcon className="h-6 w-6 text-slate-700" />;
    case 'zendesk':
      return <LayoutGrid className="h-6 w-6 text-slate-700" />;
    case 'intercom':
      return <MessageSquare className="h-6 w-6 text-slate-700" />;
    case 'segment':
      return <FileBarChart className="h-6 w-6 text-slate-700" />;
    default:
      return <BoxIcon className="h-6 w-6 text-slate-700" />;
  }
};

export function IntegrationList({ integrations }: IntegrationListProps) {
  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
        <CardTitle className="text-lg font-medium text-slate-900">Connected Integrations</CardTitle>
        <a href="#" className="text-sm font-medium text-primary hover:text-indigo-700">Manage</a>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-200">
          {integrations.map(integration => (
            <div key={integration.id} className="px-6 py-4 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                  {getIconComponent(integration.icon)}
                </div>
              </div>
              <div className="min-w-0 flex-1 ml-4">
                <h4 className="text-sm font-medium text-slate-900">{integration.name}</h4>
                <p className="text-xs text-slate-500">Data integrated {integration.lastIntegrated}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
