
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./components/error-boundary";
import { AuthProvider } from "./lib/auth/auth-provider";
import { ProtectedRoute } from "./lib/auth/protected-route";

// Pages
import Home from "./pages/home";
import Nexus from "./pages/nexus";
import OneClickTools from "./pages/one-click-tools";
import AuthPage from "./pages/auth";
import Unauthorized from "./pages/unauthorized";
import Upgrade from "./pages/upgrade";
import UserManagement from "./pages/admin/user-management";
import NotFound from "./pages/not-found";
import { queryClient } from "./lib/query-client";

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
        requiredRoles={["superadmin", "admin"]} 
      />
      
      {/* Fallback for not found routes */}
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
