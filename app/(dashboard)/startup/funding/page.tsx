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
  Plus,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";

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

interface FundingType {
  value: string;
  label: string;
}

const fundingTypes: FundingType[] = [
  { value: "seed", label: "Seed Funding" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B" },
  { value: "series_c", label: "Series C" },
  { value: "private_equity", label: "Private Equity" },
  { value: "venture_debt", label: "Venture Debt" },
  { value: "convertible_note", label: "Convertible Note" },
  { value: "bridge_round", label: "Bridge Round" },
];

interface FundingAgency {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  agencyName: string;
  logo?: {
    secure_url: string;
  };
}

interface FundingFormData {
  amount: string;
  fundingType: string;
  message: string;
  fundingAgencyId: string;
}

export default function FundingPage() {
  const [activeInvestments, setActiveInvestments] = useState<Investment[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [fundingType, setFundingType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fundingAgencies, setFundingAgencies] = useState<FundingAgency[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [formData, setFormData] = useState<FundingFormData | null>(null);
  const [showFormData, setShowFormData] = useState(false);

  useEffect(() => {
    fetchFundings();
    fetchFundingAgencies();
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

  const fetchFundingAgencies = async () => {
    try {
      const response = await fetch("/api/funding-agency/all");
      if (!response.ok) throw new Error("Failed to fetch funding agencies");
      const data = await response.json();
      setFundingAgencies(data.agencies);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch funding agencies",
        variant: "destructive",
      });
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

  const handleSubmitFunding = async () => {
    if (!amount || !fundingType || !message || !selectedAgencyId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const selectedAgency = fundingAgencies.find(a => a._id === selectedAgencyId);
    const formData = {
      amount,
      fundingType,
      message,
      fundingAgencyId: selectedAgencyId,
      fundingAgencyName: selectedAgency?.agencyName || '',
      fundingTypeLabel: fundingTypes.find(t => t.value === fundingType)?.label
    };

    // Log the form data to console
    console.log("Form Data:", formData);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/startup/fundings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit funding request");
      }

      toast({
        title: "Success",
        description: "Funding request submitted successfully",
    });
    
    // Reset form
    setAmount("");
    setFundingType("");
    setMessage("");
    setSelectedAgencyId("");
    } catch (error) {
      console.error("Error submitting funding:", error);
    toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit funding request",
        variant: "destructive",
    });
    } finally {
      setIsSubmitting(false);
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
    <div className="container max-w-7xl py-8 space-y-8">
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
        <TabsList className="grid w-full max-w-[600px] grid-cols-3">
          <TabsTrigger value="investments">
            Active Investments ({activeInvestments.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Funding Requests ({requests.length})
          </TabsTrigger>
          <TabsTrigger value="funding">Add Funding</TabsTrigger>
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

        <TabsContent value="funding">
          <Card>
            <CardHeader>
              <CardTitle>Add New Funding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 h-[100px] hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus className="h-6 w-6 mr-2" />
                      Add New Funding
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Add New Funding</DialogTitle>
                      <DialogDescription>
                        Enter the funding details below
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto">
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount (₹)</label>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Funding Type</label>
                          <Select value={fundingType} onValueChange={setFundingType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select funding type" />
                            </SelectTrigger>
                            <SelectContent>
                              {fundingTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Message</label>
                          <Textarea
                            placeholder="Enter additional details about the funding"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Funding Agency</label>
                          <RadioGroup value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[200px] overflow-y-auto rounded-lg border p-4">
                              {fundingAgencies.map((agency) => (
                                <Label
                                  key={agency._id}
                                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                                    selectedAgencyId === agency._id ? "border-primary bg-accent" : ""
                                  }`}
                                  htmlFor={agency._id}
                                >
                                  <RadioGroupItem value={agency._id} id={agency._id} />
                                  <div className="flex items-center space-x-3">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10 flex-shrink-0">
                                      {agency.logo ? (
                                        <Image
                                          src={agency.logo.secure_url}
                                          alt={agency.agencyName}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <Building2 className="h-6 w-6 m-2 text-primary" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-medium truncate">{agency.agencyName}</p>
                                      <p className="text-sm text-muted-foreground truncate">ID: {agency._id}</p>
                                      <p className="text-sm text-muted-foreground truncate">{agency.userId.email}</p>
                                    </div>
                                  </div>
                                </Label>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button 
                        className="w-full" 
                        onClick={handleSubmitFunding}
                        disabled={isSubmitting || !amount || !fundingType || !message || !selectedAgencyId}
                      >
                        {isSubmitting ? "Submitting..." : "Add Funding"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
