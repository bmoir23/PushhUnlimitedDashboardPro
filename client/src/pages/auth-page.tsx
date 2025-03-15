import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserRole, UserPlan } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Create login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  turnstileToken: z.string().min(1, "Please complete the security check")
});

// Create registration schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roles: z.array(z.enum(["free", "basic", "premium", "enterprise", "admin", "superadmin"] as const)).default(["free"]),
  plan: z.enum(["free", "basic", "premium", "enterprise"] as const).default("free"),
  turnstileToken: z.string().min(1, "Please complete the security check")
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loginToken, setLoginToken] = useState<string>("");
  const [registerToken, setRegisterToken] = useState<string>("");
  const { toast } = useToast();
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      turnstileToken: ""
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      roles: ["free"] as UserRole[],
      plan: "free" as UserPlan,
      turnstileToken: ""
    },
  });

  // Update form values when Turnstile tokens change
  useEffect(() => {
    if (loginToken) {
      loginForm.setValue("turnstileToken", loginToken);
    }
    if (registerToken) {
      registerForm.setValue("turnstileToken", registerToken);
    }
  }, [loginToken, registerToken, loginForm, registerForm]);

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    if (!data.turnstileToken) {
      toast({
        title: "Security check required",
        description: "Please complete the security check before logging in",
        variant: "destructive"
      });
      return;
    }
    loginMutation.mutate({
      username: data.username,
      password: data.password
    });
  };

  // Handle registration submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    if (!data.turnstileToken) {
      toast({
        title: "Security check required",
        description: "Please complete the security check before registering",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure we have properly typed data for the mutation
    const userData = {
      username: data.username,
      email: data.email,
      password: data.password,
      roles: data.roles as UserRole[],
      plan: data.plan as UserPlan
    };
    registerMutation.mutate(userData);
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
            <h1 className="text-3xl font-bold tracking-tight">Pushh Platform</h1>
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
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2 pb-4">
                        <FormField
                          control={loginForm.control}
                          name="turnstileToken"
                          render={() => (
                            <FormItem>
                              <FormLabel className="flex items-center mb-2">
                                <Shield className="h-4 w-4 mr-1" />
                                Security Check
                              </FormLabel>
                              <FormControl>
                                <div className="flex justify-center">
                                  <Turnstile
                                    siteKey={"1x00000000000000000000AA"}
                                    onSuccess={(token) => setLoginToken(token)}
                                    options={{
                                      theme: 'light',
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                  Secure authentication powered by Pushh Platform
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Get started with Pushh Platform today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2 pb-4">
                        <FormField
                          control={registerForm.control}
                          name="turnstileToken"
                          render={() => (
                            <FormItem>
                              <FormLabel className="flex items-center mb-2">
                                <Shield className="h-4 w-4 mr-1" />
                                Security Check
                              </FormLabel>
                              <FormControl>
                                <div className="flex justify-center">
                                  <Turnstile
                                    siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY}
                                    onSuccess={(token) => setRegisterToken(token)}
                                    options={{
                                      theme: 'light',
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                  By registering, you agree to our Terms of Service
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
            Pushh Platform helps teams streamline their operations with advanced AI capabilities, integrated monitoring, and powerful analysis tools.
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