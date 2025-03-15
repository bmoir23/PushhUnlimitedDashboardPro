import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SocialLogins } from "@/components/auth/social-logins";
import { EmailPasswordLogin } from "@/components/auth/email-password-login";
import { SignupForm } from "@/components/auth/signup-form";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Auth Page - Auth Status:", { isAuthenticated, isLoading });
    
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to home...");
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Side - Hero Section */}
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

      {/* Right Side - Auth Form */}
      <div className="lg:p-8 py-10">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to Pushh Platform
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to get started with your account
            </p>
          </div>
          
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-center">Authentication</CardTitle>
              <CardDescription className="text-center">
                Choose your preferred sign-in method
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              {/* Social Login Options */}
              <div className="mb-6">
                <SocialLogins />
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Email/Password Login and Signup */}
              <Tabs defaultValue="login" className="mt-6" onValueChange={setActiveTab} value={activeTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <EmailPasswordLogin />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
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