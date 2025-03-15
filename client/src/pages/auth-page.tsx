import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

export default function AuthPage() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Handle login with Auth0
  const handleLogin = async () => {
    await loginWithRedirect();
  };

  // Handle register with Auth0
  const handleRegister = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/onboarding"
      },
      authorizationParams: {
        screen_hint: "signup"
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Auth Form Column */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Pushh</h1>
            <p className="text-muted-foreground mt-2">AI-powered dashboard for modern teams</p>
          </div>

          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Login to your account to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleLogin}
                    className="w-full"
                  >
                    Continue with Auth0
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                  Protected by Auth0 secure authentication
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Get started with Pushh today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleRegister}
                    className="w-full"
                  >
                    Sign up with Auth0
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                  Protected by Auth0 secure authentication
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hero Column */}
      <div className="hidden lg:flex flex-1 bg-primary/5 p-12 flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Simplify your workflow with AI-powered tools
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Pushh helps teams streamline their operations with advanced AI capabilities, integrated monitoring, and powerful analysis tools.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Workflow Integration</h3>
                <p className="text-sm text-muted-foreground">Connect with Jira, Slack, and other tools</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Advanced AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Get intelligent insights from your data</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">Secure tiered access for your entire team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}