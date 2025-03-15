import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Turnstile } from "@marsidev/react-turnstile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [verifyingTurnstile, setVerifyingTurnstile] = useState(false);
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const verifyTurnstileToken = async (token: string) => {
    try {
      setVerifyingTurnstile(true);
      const response = await apiRequest("POST", "/api/verify-turnstile", { token });
      const data = await response.json();
      
      if (data.success) {
        setTurnstileVerified(true);
        return true;
      } else {
        toast({
          title: "Verification Failed",
          description: "Security check failed. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error verifying Turnstile token:", error);
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setVerifyingTurnstile(false);
    }
  };

  const handleLogin = async () => {
    if (turnstileToken) {
      if (!turnstileVerified) {
        const verified = await verifyTurnstileToken(turnstileToken);
        if (!verified) return;
      }
      
      await loginWithRedirect({
        appState: {
          turnstileToken
        }
      });
    }
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
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
                Secure login with Auth0 and Cloudflare Turnstile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="py-2 flex justify-center">
                <Turnstile
                  siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY}
                  onSuccess={handleTurnstileSuccess}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading || verifyingTurnstile || (!turnstileVerified && !turnstileToken)}
              >
                {isLoading 
                  ? "Signing in..." 
                  : verifyingTurnstile 
                    ? "Verifying..." 
                    : turnstileVerified 
                      ? "Sign in with Auth0" 
                      : turnstileToken 
                        ? "Verify and Sign in" 
                        : "Complete security check"}
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