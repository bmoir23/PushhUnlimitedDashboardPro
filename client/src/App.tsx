
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

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
  // Get redirect URI from window location
  const redirectUri = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:5000';

  // Check if Auth0 domain and client ID are available
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  
  // Log for debugging purposes only
  console.log("Auth0 Configuration:", { 
    domainAvailable: !!auth0Domain,
    clientIdAvailable: !!auth0ClientId,
    redirectUri
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={auth0Domain || ''}
        clientId={auth0ClientId || ''}
        authorizationParams={{
          redirect_uri: redirectUri,
        }}
        cacheLocation="localstorage"
      >
        <AuthProvider>
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
          <Toaster />
        </AuthProvider>
      </Auth0Provider>
    </QueryClientProvider>
  );
}

export default App;
