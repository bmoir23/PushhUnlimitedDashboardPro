import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";

// Initialize the query client
const queryClient = new QueryClient();

// Get Auth0 configuration from environment variables
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/auth`,
      audience: auth0Audience,
    }}
    cacheLocation="localstorage"
  >
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="pushh-theme">
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Auth0Provider>
);
