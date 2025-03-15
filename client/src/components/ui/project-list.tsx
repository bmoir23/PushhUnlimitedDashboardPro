import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  lastUpdated: string;
  status: 'active' | 'planning' | 'completed' | 'in-progress';
}

interface ProjectListProps {
  projects: Project[];
}

const getStatusBadgeStyle = (status: Project['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'planning':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-slate-100 text-slate-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const getStatusLabel = (status: Project['status']) => {
  switch (status) {
    case 'in-progress':
      return 'In Progress';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
        <CardTitle className="text-lg font-medium text-slate-900">Recent Projects</CardTitle>
        <a href="#" className="text-sm font-medium text-primary hover:text-indigo-700">View all</a>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-200">
          {projects.map(project => (
            <div key={project.id} className="px-6 py-4 flex items-center">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-slate-900 truncate">{project.name}</h4>
                <p className="text-sm text-slate-500">Last updated {project.lastUpdated}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <Badge variant="outline" className={getStatusBadgeStyle(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
