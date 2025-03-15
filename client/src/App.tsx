import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Nexus from "@/pages/nexus";
import OneClickTools from "@/pages/one-click-tools";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import AuthPage from "@/pages/auth-page";
import Unauthorized from "@/pages/unauthorized";
import Upgrade from "@/pages/upgrade";
import UserManagement from "@/pages/admin/user-management";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";

// Function to check if Auth0 secrets are available
async function checkAuth0Secrets() {
  try {
    // For development, we can set environment variables here
    if (!import.meta.env.VITE_AUTH0_DOMAIN || !import.meta.env.VITE_AUTH0_CLIENT_ID) {
      console.warn("Auth0 credentials not found in environment variables.");
    }
  } catch (error) {
    console.error("Error checking Auth0 secrets:", error);
  }
}

// Check for Auth0 secrets on startup
checkAuth0Secrets();

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/nexus" component={Nexus} />
              <Route path="/one-click-tools" component={OneClickTools} />
              <Route path="/auth" component={AuthPage} />
              <Route path="/unauthorized" component={Unauthorized} />
              <Route path="/upgrade" component={Upgrade} />
              <Route path="/admin/user-management">
                <ProtectedRoute requiredRole="admin" component={UserManagement} />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </ErrorBoundary>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/nexus" component={Nexus} />
      <Route path="/one-click-tools" component={OneClickTools} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/unauthorized" component={Unauthorized} />
      <Route path="/upgrade" component={Upgrade} />
      <ProtectedRoute 
        path="/admin/user-management" 
        component={UserManagement} 
        requiredRoles={["superadmin", "admin"]} 
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
