"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Loader2,
  Plus,
  MessageSquare,    
  Users,
} from "lucide-react";

interface Policy {
  _id: string;
  title: string;
  description: string;
  vision: string;
  objectives: string[];
  sectors: string[];
  industries: string[];
  metrics: {
    totalReviews: number;
    startupReviews: number;
    researcherReviews: number;
  };
  createdAt: string;
}

const PolicyCard = ({ policy }: { policy: Policy }) => {
  const router = useRouter();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
         onClick={() => router.push(`/policy-maker/policy/${policy._id}`)}>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{policy.title}</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{policy.metrics.totalReviews}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {policy.description}
        </p>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {policy.metrics.startupReviews + policy.metrics.researcherReviews} Reviews
            </span>
          </div>
          <span className="text-muted-foreground">
            {new Date(policy.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PolicyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch("/api/policy-maker/policies");
      if (!response.ok) throw new Error("Failed to fetch policies");
      const data = await response.json();
      setPolicies(data.policies);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch policies",
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

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Policies</h1>
        <Button onClick={() => router.push("/policy-maker/policy/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Policy
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {policies.map((policy) => (
            <PolicyCard key={policy._id} policy={policy} />
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}
