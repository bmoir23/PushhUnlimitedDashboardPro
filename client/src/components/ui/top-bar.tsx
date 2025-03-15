import { Search, Bell, HelpCircle } from "lucide-react";

export function TopBar() {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        </div>
        <div className="flex items-center ml-4 md:ml-6 space-x-4">
          {/* Search */}
          <div className="relative rounded-md shadow-sm max-w-xs w-full hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2" 
              placeholder="Search..."
            />
          </div>
          
          {/* Notifications */}
          <button className="p-1 rounded-full text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <Bell className="h-6 w-6" />
          </button>
          
          {/* Help */}
          <button className="p-1 rounded-full text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <HelpCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
