import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Attempt to update the user's password via Supabase (requires the recovery session from the reset link)
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error('supabase updateUser error:', error);
        toast({
          title: 'Error',
          description: 'Failed to reset password. The reset link may be invalid or expired.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated. You can now log in with your new password.',
      });

      navigate('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If the user arrived via the recovery link, parse the session from URL so Supabase client can pick it up.
    const handleSessionFromUrl = async () => {
      try {
        // This will parse and set the session if the URL contains the access token from Supabase recovery
  // getSessionFromUrl may not be present in the typed Supabase client; call it via an unknown-typed shim if available
  const authShim = supabase.auth as unknown as { getSessionFromUrl?: (opts?: { storeSession?: boolean }) => Promise<Record<string, unknown> | null> };
  const result = authShim.getSessionFromUrl ? await authShim.getSessionFromUrl({ storeSession: true }) : null;
  const resultRecord = result as Record<string, unknown> | null;
  const data = resultRecord ? (resultRecord['data'] as Record<string, unknown> | undefined) : undefined;
  const error = resultRecord ? (resultRecord['error'] as Error | undefined) : undefined;
        if (error) console.debug('getSessionFromUrl error:', error);
        const session = data ? (data as Record<string, unknown>)['session'] as Record<string, unknown> | undefined : undefined;
        const userObj = session ? session['user'] as Record<string, unknown> | undefined : undefined;
        const emailFromSession = userObj ? (userObj['email'] as string | undefined) : undefined;
        if (emailFromSession) setEmail(emailFromSession);
      } catch (err) {
        console.debug('getSessionFromUrl failed', err);
      }
    };

    handleSessionFromUrl();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email and new password to reset your account password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;

