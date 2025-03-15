import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Monitor, PlusCircle } from "lucide-react";

export function DemoPages() {
  return (
    <Card className="shadow-sm border border-slate-200">
      <div className="px-6 py-5 border-b border-slate-200">
        <h3 className="text-lg font-medium text-slate-900">Active Demo Pages</h3>
        <p className="mt-1 text-sm text-slate-500">The following pages are fully interactive in this demo.</p>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nexus Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-slate-900">Nexus</h4>
                <p className="mt-1 text-sm text-slate-600">
                  AI-powered interaction hub that showcases intelligent data processing and automated workflows.
                </p>
                <div className="mt-4">
                  <Link href="/nexus">
                    <Button className="bg-primary hover:bg-indigo-700">
                      Explore Nexus
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* One-Click Tools Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                <PlusCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-slate-900">One-Click Tools</h4>
                <p className="mt-1 text-sm text-slate-600">
                  Streamlined tools for rapid execution of complex tasks with minimal configuration required.
                </p>
                <div className="mt-4">
                  <Link href="/one-click-tools">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Access Tools
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
