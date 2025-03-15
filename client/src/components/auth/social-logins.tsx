import { Button } from "@/components/ui/button";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SocialLoginProps {
  className?: string;
}

export function SocialLogins({ className = "" }: SocialLoginProps) {
  const { loginWithGoogle, loginWithLinkedIn } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading("google-oauth2");
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      setIsLoading(null);
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      setIsLoading("linkedin");
      await loginWithLinkedIn();
    } catch (error) {
      console.error("LinkedIn login error:", error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      setIsLoading(null);
    }
  };

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <Button
        variant="outline"
        type="button"
        onClick={handleGoogleLogin}
        disabled={!!isLoading}
        className="w-full"
      >
        {isLoading === "google-oauth2" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaGoogle className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={handleLinkedInLogin}
        disabled={!!isLoading}
        className="w-full"
      >
        {isLoading === "linkedin" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaLinkedin className="mr-2 h-4 w-4" />
        )}
        Continue with LinkedIn
      </Button>
    </div>
  );
}