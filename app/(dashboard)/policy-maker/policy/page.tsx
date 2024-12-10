"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";
import {
  FileText,
  ScrollText,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  FileCheck,
  CalendarClock,
} from "lucide-react";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-yellow-500/10 text-yellow-700";
      case "Active":
        return "bg-green-500/10 text-green-700";
      case "Under Review":
        return "bg-blue-500/10 text-blue-700";
      case "Archived":
        return "bg-gray-500/10 text-gray-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <Clock className="h-4 w-4" />;
      case "Active":
        return <CheckCircle className="h-4 w-4" />;
      case "Under Review":
        return <AlertCircle className="h-4 w-4" />;
      case "Archived":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
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
        <div className="flex gap-2">
          {["all", "draft", "active", "under review", "archived"].map((status) => (
            <Button
              key={status}
              variant="outline"
              size="sm"
              className={`${
                statusFilter === status 
                ? "bg-blue-500/10 text-blue-700 border-blue-200" 
                : ""
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPolicies.map((policy) => (
          <Link href={`/policy-maker/policy/${policy._id}`} key={policy._id}>
            <Card className="bg-gradient-to-br from-background to-background/80 border-muted/20 hover:shadow-md transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex flex-col h-full space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className={getStatusColor(policy.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(policy.status)}
                        {policy.status}
                      </div>
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{policy.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {policy.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1">
                      <FileCheck className="h-3.5 w-3.5" />
                      {policy.sector}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {new Date(policy.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredPolicies.length === 0 && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center text-center">
            <ScrollText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Policies Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchTerm
                ? "No policies match your search criteria"
                : "Start by creating your first policy"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
