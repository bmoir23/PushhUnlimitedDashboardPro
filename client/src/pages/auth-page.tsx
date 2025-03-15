import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Auth Page - Auth Status:", { isAuthenticated, isLoading });
    
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to home...");
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleLogin = async () => {
    try {
      setLoggingIn(true);
      console.log("Initiating Auth0 login with redirect...");
      
      // For debugging purposes, use a simple login flow without turnstile
      await loginWithRedirect({
        appState: {
          returnTo: window.location.origin
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <h1 className="text-2xl font-bold">Pushh Platform</h1>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Pushh Platform has revolutionized how we handle our projects. The AI-powered features and seamless integrations have made our workflow incredibly efficient."
            </p>
            <footer className="text-sm">Sofia Davis, Product Manager</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to Pushh Platform
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to get started
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Secure login with Auth0
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>Click the button below to sign in to your account</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading || loggingIn}
              >
                {isLoading || loggingIn ? "Signing in..." : "Sign in with Auth0"}
              </Button>
            </CardFooter>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}