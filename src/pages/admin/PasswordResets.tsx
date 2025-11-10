import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordResetRequest {
  id: string;
  email: string;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at: string | null;
}

const PASSWORD_RESET_REQUESTS_KEY = "password_reset_requests";

const getPasswordResetRequests = (): PasswordResetRequest[] => {
  try {
    const raw = localStorage.getItem(PASSWORD_RESET_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const updatePasswordResetRequest = (id: string, updates: Partial<PasswordResetRequest>) => {
  const requests = getPasswordResetRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    localStorage.setItem(PASSWORD_RESET_REQUESTS_KEY, JSON.stringify(requests));
  }
};

const PasswordResets = () => {
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadResetRequests = useCallback(() => {
    try {
      setIsLoading(true);
      const requests = getPasswordResetRequests();
      setResetRequests(requests);
    } catch (error: unknown) {
      console.error('Error loading reset requests:', error);
      toast({
        title: "Error loading requests",
        description: "Failed to load password reset requests.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadResetRequests();
  }, [loadResetRequests]);

  const handleMarkCompleted = (id: string) => {
    updatePasswordResetRequest(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
    loadResetRequests();
    toast({
      title: "Request completed",
      description: "Password reset request has been marked as completed.",
    });
  };

  const filteredRequests = resetRequests.filter(request =>
    request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Password Reset Requests</CardTitle>
          <CardDescription>
            Manage password reset requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No password reset requests found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Completed At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                        {request.status === 'completed' ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertCircle className="mr-1 h-3 w-3" />
                        )}
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {request.completed_at
                        ? new Date(request.completed_at).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkCompleted(request.id)}
                        >
                          Mark Completed
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResets;
