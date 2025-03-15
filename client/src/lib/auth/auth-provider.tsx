import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
  const redirectUri = window.location.origin;

  // In development, we might not have Auth0 credentials
  if (!(domain && clientId)) {
    console.warn("Auth0 credentials not found");
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}