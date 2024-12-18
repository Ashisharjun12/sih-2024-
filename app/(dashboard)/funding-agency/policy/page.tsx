"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Loader2,
  MessageSquare,
  Target,
  Layers,
  Factory,
  Eye,
  Send,
} from "lucide-react";

interface Review {
  _id: string;
  reviewer: {
    _id: string;
    startupName?: string;
    name?: string;
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
  reviews: Review[];
  metrics: {
    totalReviews: number;
    startupReviews: number;
    researcherReviews: number;
  };
}

const PolicyCard = ({
  policy,
  onReview,
  hasReviewed,
}: {
  policy: Policy;
  onReview: (policy: Policy) => void;
  hasReviewed: boolean;
}) => (
  <Card className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border-0">
    <CardHeader>
      <CardTitle className="flex justify-between items-start">
        <span className="text-yellow-700">{policy.title}</span>
        <div className="flex items-center gap-2 text-sm text-yellow-600">
          <MessageSquare className="h-4 w-4" />
          <span>{policy.metrics.totalReviews}</span>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {policy.description}
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2 text-yellow-700">
            <Target className="h-4 w-4 text-yellow-500" /> Objectives
          </h4>
          <ul className="text-sm text-muted-foreground list-disc list-inside">
            {policy.objectives.slice(0, 2).map((objective, index) => (
              <li key={index} className="line-clamp-1">
                {objective}
              </li>
            ))}
            {policy.objectives.length > 2 && (
              <li>+{policy.objectives.length - 2} more</li>
            )}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          {policy.sectors.slice(0, 3).map((sector) => (
            <Badge key={sector} variant="outline" className="bg-yellow-100/50 text-yellow-700 border-yellow-200">
              {sector}
            </Badge>
          ))}
          {policy.sectors.length > 3 && (
            <Badge variant="outline" className="bg-yellow-100/50 text-yellow-700 border-yellow-200">
              +{policy.sectors.length - 3} more
            </Badge>
          )}
        </div>

        <Button
          onClick={() => onReview(policy)}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white border-0"
          variant="outline"
        >
          Review Policy
        </Button>
      </div>
    </CardContent>
  </Card>
);

const PolicyReviewDialog = ({
  policy,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  policy: Policy | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const [message, setMessage] = useState("");

  if (!policy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border-0">
        <DialogHeader>
          <DialogTitle className="text-yellow-700">{policy.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2 bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 text-yellow-700">
              <Eye className="h-4 w-4 text-yellow-500" /> Vision
            </h3>
            <p className="text-sm text-muted-foreground">{policy.vision}</p>
          </div>

          <div className="space-y-2 bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 text-yellow-700">
              <Target className="h-4 w-4 text-yellow-500" /> Objectives
            </h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              {policy.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 text-yellow-700">
              <Layers className="h-4 w-4 text-yellow-500" /> Target Sectors
            </h3>
            <div className="flex flex-wrap gap-2">
              {policy.sectors.map((sector) => (
                <Badge key={sector} variant="outline" className="bg-yellow-100/50 text-yellow-700 border-yellow-200">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2 bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 text-yellow-700">
              <Factory className="h-4 w-4 text-yellow-500" /> Target Industries
            </h3>
            <div className="flex flex-wrap gap-2">
              {policy.industries.map((industry) => (
                <Badge key={industry} variant="outline" className="bg-yellow-100/50 text-yellow-700 border-yellow-200">
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2 bg-white/50 rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 text-yellow-700">
              <MessageSquare className="h-4 w-4 text-yellow-500" /> Your Review
            </h3>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts about this policy..."
              rows={4}
              className="bg-white/50 border-0 focus-visible:ring-yellow-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}
              className="text-yellow-700 hover:bg-yellow-100/50">
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(message)}
              disabled={isSubmitting || !message.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white border-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PolicyViewDialog = ({
  policy,
  review,
  isOpen,
  onClose,
  isSubmitting,
}: {
  policy: Policy | null;
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
}) => {
  if (!policy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{policy.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4" /> Vision
            </h3>
            <p className="text-sm text-muted-foreground">{policy.vision}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" /> Objectives
            </h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              {policy.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4" /> Target Sectors
            </h3>
            <div className="flex flex-wrap gap-2">
              {policy.sectors.map((sector) => (
                <Badge key={sector} variant="outline">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Factory className="h-4 w-4" /> Target Industries
            </h3>
            <div className="flex flex-wrap gap-2">
              {policy.industries.map((industry) => (
                <Badge key={industry} variant="outline">
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Your Review
              </h3>
            </div>

            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm">{review?.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Posted on {new Date(review?.createdAt || "").toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function StartupPolicyPage() {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReviews, setUserReviews] = useState<Record<string, Review>>({});

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch("/api/policies");
      if (!response.ok) throw new Error("Failed to fetch policies");
      const data = await response.json();
      setPolicies(data.policies);
      console.log(data.policies);

      // Create a map of policy ID to user's review
      const reviewMap: Record<string, Review> = {};
      data.policies.forEach((policy: Policy) => {
        const userReview = policy.reviews.find(
          (review) => review.reviewerType === "FundingAgency"
        );
        if (userReview) {
          reviewMap[policy._id] = userReview;
        }
      });
      setUserReviews(reviewMap);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch policies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (message: string) => {
    if (!selectedPolicy) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/policies/${selectedPolicy._id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      // Refresh policies to get updated data
      fetchPolicies();
      setSelectedPolicy(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Policy Review</h1>
          <p className="text-muted-foreground">
            Review and provide feedback on policies
          </p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {policies.map((policy) => (
            <PolicyCard
              key={policy._id}
              policy={policy}
              onReview={setSelectedPolicy}
              hasReviewed={!!userReviews[policy._id]}
            />
          ))}
        </motion.div>
      </ScrollArea>

      {selectedPolicy && !userReviews[selectedPolicy._id] ? (
        <PolicyReviewDialog
          policy={selectedPolicy}
          isOpen={!!selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />
      ) : (
        <PolicyViewDialog
          policy={selectedPolicy}
          review={selectedPolicy ? userReviews[selectedPolicy._id] : null}
          isOpen={!!selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
