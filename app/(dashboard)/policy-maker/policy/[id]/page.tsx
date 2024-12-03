"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Loader2,
  Building,
  GraduationCap,
  Target,
  Layers,
  Factory,
  MessageSquare,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  reviews: Review[];
  metrics: {
    totalReviews: number;
    startupReviews: number;
    researcherReviews: number;
    fundingAgencyReviews: number;
  };
}

const PolicySection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <Card className="mb-4">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-base">
            {review.reviewerType === "Startup"
              ? review.reviewer.startupName
              : review.reviewer.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {review.reviewer.email}
          </p>
        </div>
        <Badge>{review.reviewerType}</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm">{review.message}</p>
      <p className="text-xs text-muted-foreground mt-2">
        {new Date(review.createdAt).toLocaleString()}
      </p>
    </CardContent>
  </Card>
);

export default function PolicyDetailPage() {
  const params = useParams();
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

  const deletePolicy = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/policy-maker/policies/${params.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete policy");
      router.push("/policy-maker/policy");
      toast({
        title: "Policy deleted",
        description: "Policy has been deleted successfully",
        variant: "default",
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete policy",
        variant: "destructive",
      });
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
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{policy.title}</h1>
            <p className="text-muted-foreground">{policy.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{policy.metrics.startupReviews} Startups</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>{policy.metrics.researcherReviews} Researchers</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>{policy.metrics.fundingAgencyReviews} Funding Agency</span>
            </div>
          </div>
          <div>
            <Button onClick={deletePolicy}>Delete</Button>
          </div>
        </div>

        <PolicySection title="Vision" icon={Eye}>
          <p className="text-gray-600">{policy.vision}</p>
        </PolicySection>

        <PolicySection title="Objectives" icon={Target}>
          <ul className="list-disc list-inside space-y-2">
            {policy.objectives.map((objective, index) => (
              <li key={index} className="text-gray-600">
                {objective}
              </li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection title="Target Sectors" icon={Layers}>
          <div className="flex flex-wrap gap-2">
            {policy.sectors.map((sector) => (
              <Badge key={sector} variant="outline">
                {sector}
              </Badge>
            ))}
          </div>
        </PolicySection>

        <PolicySection title="Target Industries" icon={Factory}>
          <div className="flex flex-wrap gap-2">
            {policy.industries.map((industry) => (
              <Badge key={industry} variant="outline">
                {industry}
              </Badge>
            ))}
          </div>
        </PolicySection>

        <PolicySection title="Reviews & Feedback" icon={MessageSquare}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                All Reviews ({policy.metrics.totalReviews})
              </TabsTrigger>
              <TabsTrigger value="startup">
                Startup Reviews ({policy.metrics.startupReviews})
              </TabsTrigger>
              <TabsTrigger value="researcher">
                Researcher Reviews ({policy.metrics.researcherReviews})
              </TabsTrigger>
              <TabsTrigger value="fundingAgency">
                Funding Agency Reviews ({policy.metrics.fundingAgencyReviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ScrollArea className="h-[calc(100vh-32rem)]">
                {policy.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="startup">
              <ScrollArea className="h-[calc(100vh-32rem)]">
                {policy.reviews
                  .filter((review) => review.reviewerType === "Startup")
                  .map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="researcher">
              <ScrollArea className="h-[calc(100vh-32rem)]">
                {policy.reviews
                  .filter((review) => review.reviewerType === "Researcher")
                  .map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="fundingAgency">
              <ScrollArea className="h-[calc(100vh-32rem)]">
                {policy.reviews
                  .filter((review) => review.reviewerType === "FundingAgency")
                  .map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </PolicySection>
      </motion.div>
    </div>
  );
}
