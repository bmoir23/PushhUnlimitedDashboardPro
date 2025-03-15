import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { useState } from "react";

type TimeRange = '7d' | '30d' | '90d';

export function AnalyticsOverview() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="px-6 py-5 border-b border-slate-200 flex justify-between items-center flex-col sm:flex-row space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="text-lg font-medium text-slate-900">Analytics Overview</CardTitle>
          <p className="mt-1 text-sm text-slate-500">Data from connected analytics platforms</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant={timeRange === '7d' ? 'outline' : 'ghost'} 
            size="sm"
            onClick={() => setTimeRange('7d')}
            className={timeRange === '7d' ? 'border-slate-300' : ''}
          >
            Last 7 days
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'outline' : 'ghost'} 
            size="sm"
            onClick={() => setTimeRange('30d')}
            className={timeRange === '30d' ? 'border-primary text-primary' : ''}
          >
            Last 30 days
          </Button>
          <Button 
            variant={timeRange === '90d' ? 'outline' : 'ghost'} 
            size="sm"
            onClick={() => setTimeRange('90d')}
            className={timeRange === '90d' ? 'border-slate-300' : ''}
          >
            Last 90 days
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-5">
        <div className="h-64 w-full bg-slate-50 rounded border border-slate-200 flex items-center justify-center">
          <div className="text-center">
            <BarChart className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">Analytics data visualization will appear here</p>
            <p className="text-xs text-slate-400">(Demo content - Analytics integration required)</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="text-sm">
          <span className="font-medium text-slate-900">Connected platforms: </span>
          <span className="text-slate-500">Mixpanel, PostHog, Amplitude</span>
        </div>
      </CardFooter>
    </Card>
  );
}
