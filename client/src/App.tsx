
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Auth0Provider } from "@auth0/auth0-react";

// Pages
import Home from "./pages/home";
import Nexus from "./pages/nexus";
import OneClickTools from "./pages/one-click-tools";
import Unauthorized from "./pages/unauthorized";
import Upgrade from "./pages/upgrade";
import UserManagement from "./pages/admin/user-management";
import NotFound from "./pages/not-found";
import { queryClient } from "@/lib/queryClient";

// We'll add this back once we have a proper Auth page
// import AuthPage from "./pages/auth-page";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      {/* We'll add this back once we have a proper Auth page */}
      {/* <Route path="/auth" component={AuthPage} /> */}
      <Route path="/unauthorized" component={Unauthorized} />
      
      {/* Protected Routes */}
      {/* For now, we'll disable route protection until our Auth0 is set up properly */}
      <Route path="/" component={Home} />
      <Route path="/nexus" component={Nexus} />
      <Route path="/one-click-tools" component={OneClickTools} />
      <Route path="/upgrade" component={Upgrade} />
      
      {/* Admin Routes */}
      <Route path="/admin/user-management" component={UserManagement} />
      
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

  return (
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN || ''}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ''}
        authorizationParams={{
          redirect_uri: redirectUri,
        }}
      >
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
        <Toaster />
      </Auth0Provider>
    </QueryClientProvider>
  );
}

export default App;
