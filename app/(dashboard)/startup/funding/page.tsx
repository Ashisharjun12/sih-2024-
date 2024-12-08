"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Building2,
  IndianRupee,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Investment {
  _id: string;
  fundingAgencyId: {
    _id: string;
    userId: string;
    agencyName: string;
    logo: {
      secure_url: string;
    };
  };
  amount: number;
  date: string;
}

interface Request {
  _id: string;
  fundingAgencyId: {
    _id: string;
    userId: string;
    agencyName: string;
    logo: {
      secure_url: string;
    };
  };
  message: string;
  createdAt: string;
}

export default function FundingPage() {
  const [activeInvestments, setActiveInvestments] = useState<Investment[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchFundings();
  }, []);

  const fetchFundings = async () => {
    try {
      console.log("Step 1: Starting to fetch fundings...");
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/startup/fundings");
      console.log("Step 2: API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch fundings");
      }

      const data = await response.json();
      console.log("Step 3: Received data:", {
        hasInvestments: !!data.activeInvestments,
        investmentsCount: data.activeInvestments?.length || 0,
        hasRequests: !!data.requests,
        requestsCount: data.requests?.length || 0
      });

      setActiveInvestments(data.activeInvestments || []);
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Error fetching fundings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch funding data");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch funding data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log("Step 4: Fetch operation completed");
    }
  };

  const handleAcceptRequest = async (fundingAgencyUserId: string, requestId: string) => {
    try {
      console.log("Step 1: Accepting request...", { requestId, fundingAgencyUserId });
      const response = await fetch(`/api/startup/fundings/requests/${requestId}/accept`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to accept request");
      }

      console.log("Step 2: Request accepted successfully");
      // Remove request from the list
      setRequests(requests.filter(req => req._id !== requestId));
      
      // Redirect to messages
      router.push(`/startup/messages/${fundingAgencyUserId}`);

      toast({
        title: "Success",
        description: "Request accepted successfully",
      });
    } catch (err) {
      console.error("Error accepting request:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      console.log("Step 1: Rejecting request...", { requestId });
      const response = await fetch(`/api/startup/fundings/requests/${requestId}/reject`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject request");
      }

      console.log("Step 2: Request rejected successfully");
      setRequests(requests.filter(req => req._id !== requestId));
      toast({
        title: "Success",
        description: "Request rejected successfully",
      });
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Funding Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchFundings}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Funding Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your investments and funding requests
          </p>
        </div>
      </div>

      <Tabs defaultValue="investments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="investments">
            Active Investments ({activeInvestments.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Funding Requests ({requests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {activeInvestments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active investments found
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {activeInvestments.map((investment) => (
                      <motion.div
                        key={investment._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl border bg-card hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{investment.fundingAgencyId.agencyName}</h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">₹{investment.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm">{new Date(investment.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => router.push(`/startup/messages/${investment.fundingAgencyId.userId}`)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Open Chat
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Funding Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {requests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No funding requests found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl border bg-card hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{request.fundingAgencyId.agencyName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {request.message}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            onClick={() => handleAcceptRequest(request.fundingAgencyId.userId, request._id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept & Chat
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleRejectRequest(request._id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
