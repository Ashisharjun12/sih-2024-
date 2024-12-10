"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";
import {
  FileText,
  ScrollText,
  Building2,
  Users,
  Activity,
  TrendingUp,
  ChevronRight,
  FileCheck,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface PolicyStats {
  totalPolicies: number;
  activePolicies: number;
  draftPolicies: number;
  underReview: number;
}

interface StartupMetrics {
  totalStartups: number;
  activeStartups: number;
  growth: string;
  sectors: { name: string; count: number }[];
}

export default function PolicyMakerDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PolicyStats>({
    totalPolicies: 0,
    activePolicies: 0,
    draftPolicies: 0,
    underReview: 0
  });
  const [metrics, setMetrics] = useState<StartupMetrics>({
    totalStartups: 0,
    activeStartups: 0,
    growth: "+0%",
    sectors: []
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        totalPolicies: 45,
        activePolicies: 32,
        draftPolicies: 8,
        underReview: 5
      });
      setMetrics({
        totalStartups: 250,
        activeStartups: 180,
        growth: "+12%",
        sectors: [
          { name: "Technology", count: 85 },
          { name: "Healthcare", count: 45 },
          { name: "Finance", count: 35 },
          { name: "Education", count: 25 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container px-4 md:px-8 py-4 md:py-8 space-y-6 md:space-y-8 mb-16 md:mb-0">
      {/* Header Section - Made more compact on mobile */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Policy Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              Monitor and manage policy frameworks and startup ecosystem
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid - Adjusted for better mobile layout */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatsCard
          title="Total Policies"
          value={stats.totalPolicies}
          icon={ScrollText}
          loading={loading}
        />
        <StatsCard
          title="Active Policies"
          value={stats.activePolicies}
          icon={FileCheck}
          loading={loading}
        />
        <StatsCard
          title="Draft Policies"
          value={stats.draftPolicies}
          icon={FileText}
          loading={loading}
        />
        <StatsCard
          title="Under Review"
          value={stats.underReview}
          icon={BookOpen}
          loading={loading}
        />
      </div>

      {/* Startup Metrics - Improved mobile layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
              Startup Ecosystem
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-6 md:space-y-8">
              {/* Stats Grid - Made responsive */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Total Startups</p>
                  <p className="text-lg md:text-2xl font-semibold">{metrics.totalStartups}</p>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Active Startups</p>
                  <p className="text-lg md:text-2xl font-semibold">{metrics.activeStartups}</p>
                </div>
                <div className="space-y-1 md:space-y-2 col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Growth Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg md:text-2xl font-semibold">{metrics.growth}</p>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Sector Distribution - Improved scrolling on mobile */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Sector Distribution</h4>
                  <Button variant="ghost" size="sm" className="text-blue-600 hidden md:flex">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <ScrollArea className="w-full">
                  <div className="flex space-x-3 md:space-x-4 pb-4">
                    {metrics.sectors.map((sector, index) => (
                      <Card key={index} className="flex-none w-[160px] md:w-[200px]">
                        <CardContent className="p-3 md:p-4">
                          <div className="space-y-2">
                            <p className="text-xs md:text-sm font-medium">{sector.name}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">{sector.count} startups</Badge>
                              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities Card - Made responsive */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    {i === 0 ? (
                      <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                    ) : i === 1 ? (
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                    ) : (
                      <Building2 className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-medium">
                      {i === 0
                        ? "New Policy Draft Created"
                        : i === 1
                        ? "Startup Application Review"
                        : "Framework Update"}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Update StatsCard for better mobile display
function StatsCard({ title, value, icon: Icon, loading }: { 
  title: string; 
  value: number; 
  icon: any;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 rounded-xl bg-blue-500/10">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-5 md:h-6 w-12 md:w-16 bg-muted animate-pulse rounded mt-1" />
            ) : (
              <p className="text-lg md:text-2xl font-semibold">{value}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 