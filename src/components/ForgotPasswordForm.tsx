import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/lib/auth";

export interface ForgotPasswordFormProps {
  onBack: () => void;
}

const PASSWORD_RESET_REQUESTS_KEY = "password_reset_requests";

interface PasswordResetRequest {
  id: string;
  email: string;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at: string | null;
}

const getPasswordResetRequests = (): PasswordResetRequest[] => {
  try {
    const raw = localStorage.getItem(PASSWORD_RESET_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const savePasswordResetRequest = (request: PasswordResetRequest) => {
  const requests = getPasswordResetRequests();
  requests.push(request);
  localStorage.setItem(PASSWORD_RESET_REQUESTS_KEY, JSON.stringify(requests));
};

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call Supabase reset password helper which sends the email
      const { data, error } = await resetPassword(email.trim().toLowerCase());
      if (error) {
        console.error('resetPassword error:', error);
        // Surface an error to the user if Supabase explicitly returned one
        toast({
          title: 'Unable to send reset email',
          description: error.message || 'Failed to send reset instructions. Please try again later.',
          variant: 'destructive',
        });
        return;
      }

      // Show a generic success message to avoid leaking whether the account exists
      toast({
        title: 'Request submitted',
        description: 'If an account exists with this email, you will receive reset instructions via email. Check your inbox and spam folder.',
      });

      // Return to login page after request
      onBack();
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you instructions to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full"
          disabled={isLoading}
        >
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
