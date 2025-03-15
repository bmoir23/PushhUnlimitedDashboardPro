import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SocialLoginProps {
  className?: string;
}

export function SocialLogins({ className = "" }: SocialLoginProps) {
  const { loginWithRedirect } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSocialLogin = async (connection: string) => {
    try {
      setIsLoading(connection);
      await loginWithRedirect({
        authorizationParams: {
          connection,
        },
        appState: {
          returnTo: window.location.origin,
        },
      });
    } catch (error) {
      console.error(`${connection} login error:`, error);
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
        onClick={() => handleSocialLogin("google-oauth2")}
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
        onClick={() => handleSocialLogin("github")}
        disabled={!!isLoading}
        className="w-full"
      >
        {isLoading === "github" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaGithub className="mr-2 h-4 w-4" />
        )}
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => handleSocialLogin("linkedin")}
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
      <Button
        variant="outline"
        type="button"
        onClick={() => handleSocialLogin("twitter")}
        disabled={!!isLoading}
        className="w-full"
      >
        {isLoading === "twitter" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaTwitter className="mr-2 h-4 w-4" />
        )}
        Continue with Twitter
      </Button>
    </div>
  );
}