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
  const [walletBalance, setWalletBalance] = useState("");
  const [transferredRequests, setTransferredRequest] = useState([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchFundings();
    fetchWalletBalance();
  }, []);

  const fetchFundings = async () => {
    try {
      const response = await fetch("/api/funding-agency/fundings");
      if (!response.ok) throw new Error("Failed to fetch fundings");
      const data = await response.json();
      setActiveInvestments(data.activeInvestments);
      console.log(data)
      const requests = data.requests;
      const transferredRequests = data.requested.filter(req=>req.status === "transferred")
      setRequests(requests);
      setTransferredRequest(transferredRequests);
      setIsLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch funding data",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (startupUserId: string, requestId: string) => {
    try {
      const response = await fetch(`/api/funding-agency/fundings/requests/${requestId}/accept`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to accept request");

      // Remove request from the list
      setRequests(requests.filter(req => req._id !== requestId));
      
      // Redirect to messages
      router.push(`/funding-agency/messages/${startupUserId}`);

      toast({
        title: "Success",
        description: "Request accepted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/funding-agency/fundings/requests/${requestId}/reject`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to reject request");
      
      setRequests(requests.filter(req => req._id !== requestId));
      toast({
        title: "Success",
        description: "Request rejected successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const res = await fetch('/api/wallet/balance');
      const data = await res.json();
      if (data.success) {
        setWalletBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };


  // const handleFund = async () => {
  //   if (!selectedStartup || !fundingAmount || !paymentMethod) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill all required fields",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsProcessing(true);
  //   try {
  //     const res = await fetch('/api/wallet/transfer', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         receiverId: selectedStartup.userId,
  //         amount: Number(fundingAmount)
  //       })
  //     });

  //     const data = await res.json();
      
  //     if (data.success) {
  //       toast({
  //         title: "Success",
  //         description: `Successfully funded ${selectedStartup.startupDetails.startupName}`,
  //       });
  //       setShowFundingModal(false);
  //       resetForm();
  //     } else {
  //       throw new Error(data.error || "Failed to process funding");
  //     }
  //   } catch (error) {
  //     console.error('Funding error:', error);
  //     toast({
  //       title: "Error",
  //       description: error instanceof Error ? error.message : "Failed to process funding",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <TabsTrigger value="investments">Active Investments</TabsTrigger>
          <TabsTrigger value="requests">Funding Requests</TabsTrigger>
          <TabsTrigger value = "transfer">Transfer requests</TabsTrigger>
        </TabsList>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
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
                          <h3 className="font-semibold">{investment.startup.startupName}</h3>
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
                        onClick={() => router.push(`/funding-agency/messages/${investment.startup.userId}`)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Open Chat
                      </Button>
                    </motion.div>
                  ))}
                </div>
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
                          <h3 className="font-semibold">{request.startup.startupName}</h3>
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
                          onClick={() => handleAcceptRequest(request.startup.userId, request._id)}
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
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {transferredRequests.map((request) => (
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
                          <h3 className="font-semibold">{request.startup.startupName}</h3>
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
                          onClick={() => handleAcceptRequest(request.startup.userId, request._id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept & Pay
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
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
