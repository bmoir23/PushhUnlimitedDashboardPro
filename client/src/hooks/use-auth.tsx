import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User | null, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User | null, Error, RegisterData>;
  hasRole: (role: string) => boolean;
  hasPlan: (plan: string) => boolean;
};

interface TurnstileData {
  turnstileToken: string;
}

type LoginData = {
  email: string;
  password: string;
} & Partial<TurnstileData>;

type RegisterData = {
  email: string;
  password: string;
  metadata?: {
    username?: string;
    plan?: string;
    roles?: string[];
  };
} & Partial<TurnstileData>;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password, turnstileToken }: LoginData) => {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return user;
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, metadata, turnstileToken }: RegisterData) => {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      return user;
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const hasRole = (role: string) => {
    return user?.user_metadata?.roles?.includes(role) ?? false;
  };

  const hasPlan = (plan: string) => {
    return user?.user_metadata?.plan === plan;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: loading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        hasRole,
        hasPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}