import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, MessageSquare, Filter, Search, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  rating: number;
  category: string;
  message: string;
  userEmail?: string;
  userName?: string;
  createdAt: string;
  status: string;
}

const categoryLabels: Record<string, string> = {
  general: "General Feedback",
  appointment: "Appointment Service",
  veterinary: "Veterinary Care",
  grooming: "Pet Grooming",
  pharmacy: "Pharmacy Services",
  website: "Website Experience",
  staff: "Staff Service",
  other: "Other"
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewed: "bg-green-100 text-green-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-gray-100 text-gray-800"
};

export default function Feedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    filterFeedback();
  }, [feedback, searchTerm, categoryFilter, ratingFilter, statusFilter]);

  const loadFeedback = () => {
    try {
      const storedFeedback = localStorage.getItem("feedback");
      if (storedFeedback) {
        const parsedFeedback = JSON.parse(storedFeedback);
        setFeedback(parsedFeedback);
      }
    } catch (error) {
      console.error("Error loading feedback:", error);
      toast({
        title: "Error",
        description: "Failed to load feedback data.",
        variant: "destructive",
      });
    }
  };

  const filterFeedback = () => {
    let filtered = [...feedback];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (ratingFilter && ratingFilter !== "all") {
      filtered = filtered.filter((item) => item.rating === parseInt(ratingFilter));
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredFeedback(filtered);
  };

  const updateFeedbackStatus = (id: string, newStatus: string) => {
    try {
      const updatedFeedback = feedback.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      );
      setFeedback(updatedFeedback);
      localStorage.setItem("feedback", JSON.stringify(updatedFeedback));
      
      toast({
        title: "Status Updated",
        description: "Feedback status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feedback status.",
        variant: "destructive",
      });
    }
  };

  const deleteFeedback = (id: string) => {
    try {
      const updatedFeedback = feedback.filter((item) => item.id !== id);
      setFeedback(updatedFeedback);
      localStorage.setItem("feedback", JSON.stringify(updatedFeedback));
      
      toast({
        title: "Feedback Deleted",
        description: "Feedback has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete feedback.",
        variant: "destructive",
      });
    }
  };

  const getAverageRating = () => {
    if (feedback.length === 0) return 0;
    const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / feedback.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedback.forEach((item) => {
      distribution[item.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feedback Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and review user feedback
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-pet-blue-dark" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {feedback.length} total feedback
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{feedback.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-pet-blue-dark" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getAverageRating()}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Feedback</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {feedback.filter(f => f.status === "new").length}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">New</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {feedback.filter(f => f.status === "resolved").length}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Resolved</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feedback.length > 0
                    ? `${((ratingDistribution[rating as keyof typeof ratingDistribution] / feedback.length) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Feedback ({filteredFeedback.length} of {feedback.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No feedback found</p>
              </div>
            ) : (
              filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="outline">{categoryLabels[item.category] || item.category}</Badge>
                        <Badge className={statusColors[item.status] || "bg-gray-100 text-gray-800"}>
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {item.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.userName && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{item.userName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFeedback(item)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Feedback Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge variant="outline">{categoryLabels[item.category] || item.category}</Badge>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Message</h4>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {item.message}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">User:</span> {item.userName || "Anonymous"}
                              </div>
                              <div>
                                <span className="font-medium">Email:</span> {item.userEmail || "Not provided"}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {new Date(item.createdAt).toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span> {item.status.replace("_", " ")}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 pt-4 border-t">
                              <span className="text-sm font-medium">Update Status:</span>
                              <Select
                                value={item.status}
                                onValueChange={(value) => updateFeedbackStatus(item.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="reviewed">Reviewed</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteFeedback(item.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
