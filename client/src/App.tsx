import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider, ThemeToggle } from "@/components/theme-provider"; // Added ThemeToggle

// Pages
import Home from "./pages/home";
import Nexus from "./pages/nexus";
import OneClickTools from "./pages/one-click-tools";
import AuthPage from "./pages/auth-page";
import Unauthorized from "./pages/unauthorized";
import Upgrade from "./pages/upgrade";
import UserManagement from "./pages/admin/user-management";
import NotFound from "./pages/not-found";
import { queryClient } from "@/lib/queryClient";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/unauthorized" component={Unauthorized} />

      {/* Protected Routes */}
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/nexus" component={Nexus} />
      <ProtectedRoute path="/one-click-tools" component={OneClickTools} />
      <ProtectedRoute path="/upgrade" component={Upgrade} />

      {/* Admin Routes */}
      <ProtectedRoute 
        path="/admin/user-management" 
        component={UserManagement}
        requiredRoles={["admin", "superadmin"]} 
      />

      {/* Fallback for not found routes */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="pushh-theme"> {/* Using system theme as default */}
        <AuthProvider>
          <ErrorBoundary>
            <ThemeToggle /> {/* Added Theme Toggle */}
            <div className="min-h-screen flex flex-col bg-background"> {/* Added bg-background */}
              <Router />
            </div>
          </ErrorBoundary>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;