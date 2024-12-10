"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PolicyCard } from "@/components/policy-maker/policy-card";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

interface Policy {
  _id: string;
  title: string;
  description: string;
  status: "Draft" | "Active" | "Under Review" | "Archived";
  sector: string;
  lastUpdated: string;
  implementationDate: string;
}

export default function PolicyPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch("/api/policy-maker/policies");
      const data = await response.json();
      setPolicies(data.policies);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch policies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || policy.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container px-4 md:px-8 py-4 md:py-8 space-y-6 md:space-y-8 mb-16 md:mb-0">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Policy Framework</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              Manage and monitor policy implementations
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
              <Link href="/policy-maker/policy/new">
                <Plus className="h-4 w-4 mr-2" />
                New Policy
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "draft", "active", "under review", "archived"].map((status) => (
            <Button
              key={status}
              variant="outline"
              size="sm"
              className={`${
                statusFilter === status 
                ? "bg-blue-500/10 text-blue-700 border-blue-200" 
                : ""
              } whitespace-nowrap`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-[200px]" />
            </div>
          ))
        ) : filteredPolicies.length > 0 ? (
          // Policy cards
          filteredPolicies.map((policy) => (
            <PolicyCard
              key={policy._id}
              policy={policy}
              onClick={() => router.push(`/policy-maker/policy/${policy._id}`)}
            />
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm
                ? "No policies match your search criteria"
                : "No policies found. Create your first policy!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
