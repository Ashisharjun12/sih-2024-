"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Startup {
  _id: string;
  userId: string;
  startupDetails: {
    startupName: string;
    startupLogo?: {
      secure_url: string;
    };
    industries: string[];
    stage: string;
  };
}

interface Request {
  _id: string;
  startup: Startup;
  amount: number;
  fundingType: 'Debt' | 'Equity';
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function RequestedStartupsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/funding-agency/requested");
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast({
        title: "Error",
        description: "Failed to fetch requested startups",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch(`/api/funding-agency/requested/${requestId}/accept`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to accept request");

      // Update the request status locally
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status: 'accepted' } : req
      ));

      toast({
        title: "Success",
        description: "Request accepted successfully",
      });
    } catch (err) {
      console.error("Error accepting request:", err);
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`/api/funding-agency/requested/${requestId}/reject`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to reject request");

      // Update the request status locally
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status: 'rejected' } : req
      ));

      toast({
        title: "Success",
        description: "Request rejected successfully",
      });
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast({
        title: "Error",
        description: "Failed to reject request",
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

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Requested Startups
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your funding requests to startups
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
            <p className="text-muted-foreground text-center">
              You haven't sent any funding requests to startups yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <Card key={request._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  {request.startup.startupDetails.startupLogo ? (
                    <Image
                      src={request.startup.startupDetails.startupLogo.secure_url}
                      alt={request.startup.startupDetails.startupName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-xl">
                        {request.startup.startupDetails.startupName[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      {request.startup.startupDetails.startupName}
                    </CardTitle>
                    <CardDescription>
                      Stage: {request.startup.startupDetails.stage}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Amount: ₹{request.amount.toLocaleString()}</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Type: {request.fundingType}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Industries:</p>
                    <div className="flex flex-wrap gap-2">
                      {request.startup.startupDetails.industries.map((industry, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {request.message}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Requested on {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
                {request.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={() => handleAccept(request._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleReject(request._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {request.status === 'accepted' && (
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/funding-agency/messages/${request.startup.userId}`)}
                  >
                    Message Startup
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 