"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";


interface Startup {
  _id: string;
  userId: string;
  startupName: string;
  startupLogo: {
    public_id: string;
    secure_url: string;
  } | null;
}

interface Request {
  _id: string;
  startup: Startup;
  message: string;
  createdAt: string;
}

export default function FundingApplicationsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/funding-agency/fundings");
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data.requests);
      setIsLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch funding requests",
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
          Funding Applications
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and manage funding requests from startups
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="text-lg font-semibold mb-2">No Funding Requests</h3>
            <p className="text-muted-foreground text-center">
              You don't have any pending funding requests at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <Card key={request._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  {request.startup.startupLogo ? (
                    <Image
                      src={request.startup.startupLogo.secure_url}
                      alt={request.startup.startupName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-xl">
                        {request.startup.startupName[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      {request.startup.startupName}
                    </CardTitle>
                    <CardDescription>
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {request.message}
                </p>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => handleAcceptRequest(request.startup.userId, request._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleRejectRequest(request._id)}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}