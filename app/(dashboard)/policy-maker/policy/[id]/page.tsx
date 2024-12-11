"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Target,
  MessageCircle,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Clock,
  Loader2,
} from "lucide-react";

interface Review {
  _id: string;
  reviewer: {
    _id: string;
    name?: string;
    startupName?: string;
    email: string;
  };
  reviewerType: "Startup" | "Researcher" | "FundingAgency";
  message: string;
  createdAt: string;
}

interface Policy {
  _id: string;
  title: string;
  description: string;
  vision: string;
  objectives: string[];
  sectors: string[];
  industries: string[];
  status: "Draft" | "Active" | "Archived";
  implementationDate: string;
  reviews: Review[];
  metrics: {
    totalReviews: number;
    startupReviews: number;
    researcherReviews: number;
    fundingAgencyReviews: number;
  };
}

export default function PolicyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await fetch(`/api/policy-maker/policies/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch policy");
      const data = await response.json();
      setPolicy(data.policy);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch policy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/policy-maker/policies/${params.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete policy");
      }

      toast({
        title: "Success",
        description: "Policy deleted successfully",
      });

      router.push("/policy-maker/policy");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete policy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!policy) return null;

  return (
    <div className="container py-6 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-4 md:p-8">
        <div className="flex flex-col gap-4">
          <Button 
            variant="outline" 
            className="w-fit bg-background/50 backdrop-blur-sm hover:bg-background/60"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Policies
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">{policy.title}</h1>
            <div className="flex flex-wrap gap-2">
              {policy.sectors.map((sector) => (
                <Badge 
                  key={sector}
                  variant="secondary" 
                  className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                >
                  {sector}
                </Badge>
              ))}
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(policy.implementationDate).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Vision Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-blue-600" />
                Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{policy.vision}</p>
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{policy.description}</p>
            </CardContent>
          </Card>

          {/* Objectives Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-blue-600" />
                Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {policy.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-600 text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push(`/policy-maker/policy/${params.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Policy
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Policy
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">
                  {policy.reviews?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-emerald-600">
                  {policy.status === "Active" ? "Live" : policy.status}
                </p>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policy.reviews?.map((review) => (
                  <div
                    key={review._id}
                    className="p-4 rounded-lg bg-muted/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {review.reviewer.startupName || review.reviewer.name || review.reviewer.email}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.message}</p>
                  </div>
                ))}
                {(!policy.reviews || policy.reviews.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    No reviews yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Keep all dialogs and modals same */}
    </div>
  );
}
