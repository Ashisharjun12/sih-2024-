"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BurnRate } from "@/components/graphs/burnRate";
import { CustomerAcquisitionRate } from "@/components/graphs/customerAcquisitionRate";
import Revenue from "@/components/graphs/revenue";
import GrossMargin from "@/components/graphs/grossMargin";
import { ROIChart } from "@/components/graphs/roi";
import { KPIChart } from "@/components/graphs/kpi";
import { MetricsData, TimeframeKey } from "@/types/metrics";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart,
  PieChart,
  Activity
} from "lucide-react";

// Define stat types
interface StatData {
  value: number;
  change: number;
}

interface TimeframedStats {
  revenue: StatData;
  customerGrowth: StatData;
  burnRate: StatData;
  roi: StatData;
  marketShare: StatData;
  growthRate: StatData;
}

interface Startup {
  id: string;
  name: string;
  logo?: string;
  industries: string[];
  stage: string;
  businessModel: string;
  revenueModel: string;
}

export default function StartupMetrics() {
  const [timeFrame, setTimeFrame] = useState<TimeframeKey>("monthly");
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [startupId, setStartupId] = useState<string>('default');
  const [stats, setStats] = useState<TimeframedStats | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const { toast } = useToast();

  // Fetch startups list
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch('/api/startup/list');
        const data = await response.json();
        
        if (data.success) {
          setStartups(data.startups);
          // Set first startup as default if available
          if (data.startups.length > 0 && startupId === 'default') {
            setStartupId(data.startups[0].id);
          }
        }
        console.log(data.startups);
      } catch (error) {
        console.error('Error fetching startups:', error);
        toast({
          title: "Error",
          description: "Failed to fetch startups list",
          variant: "destructive",
        });
      }
    };

    fetchStartups();
  }, []);

  const fetchMetricsData = useCallback(async () => {
    try {
      setLoading(true);
      console.log(startupId);
      const response = await fetch(
        `/api/startup/metrics?timeframe=${timeFrame}&startupId=${startupId}`
      );
      const result = await response.json();
      console.log(result);

      if (result.success) {
        setMetricsData(result.data);
        setStats(result.data.stats);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch metrics data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch metrics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [timeFrame, startupId, toast]);

  useEffect(() => {
    if (startupId !== 'default') {
      fetchMetricsData();
    }
  }, [fetchMetricsData, startupId]);

  const handleTimeFrameChange = useCallback((newTimeFrame: string) => {
    setTimeFrame(newTimeFrame as TimeframeKey);
  }, []);

  const getStatDescription = (key: string) => {
    switch (timeFrame) {
      case "monthly":
        return "vs last month";
      case "yearly":
        return "vs last year";
      default:
        return "change";
    }
  };

  const formatStatValue = (key: string, value: number) => {
    switch (key) {
      case 'ebitda':
      case 'grossMargin':
      case 'growthRate':
        return `${value}%`;
      case 'burnRate':
        return `₹${value}K`;
      case 'car':
        return value.toString();
      case 'churnRate':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  if (loading || !metricsData) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Business Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Track your startup's performance metrics
            </p>
          </div>
          <div className="flex gap-4">
            {/* Startup Selector */}
            <Select
              value={startupId}
              onValueChange={setStartupId}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select startup" />
              </SelectTrigger>
              <SelectContent>
                {startups.map((startup) => (
                  <SelectItem key={startup.id} value={startup.id}>
                    <div className="flex items-center gap-2">
                      {startup.logo && (
                        <img 
                          src={startup.logo} 
                          alt={startup.name} 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span>{startup.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Time Frame Selector */}
            <Select
              value={timeFrame}
              onValueChange={handleTimeFrameChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats && Object.entries(stats).map(([key, stat], index) => {
            const isNegativeGood = key === 'burnRate';
            const isPositive = stat.change > 0;
            const textColorClass = isNegativeGood 
              ? (!isPositive ? 'text-green-600' : 'text-red-600')
              : (isPositive ? 'text-green-600' : 'text-red-600');

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                    <div className="p-2 bg-primary/10 rounded-full">
                      {getStatIcon(key)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatStatValue(key, stat.value)}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${textColorClass} flex items-center gap-1`}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                        <TrendingUp 
                          className={`h-3 w-3 ${!isPositive ? 'rotate-180' : ''}`} 
                        />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getStatDescription(key)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Graphs Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ROIChart startupId={startupId} />
            <ROIChart startupId={startupId} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <KPIChart startupId={startupId} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CustomerAcquisitionRate startupId={startupId} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Revenue startupId={startupId} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BurnRate startupId={startupId} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GrossMargin startupId={startupId} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function getStatIcon(key: string) {
  const iconClass = "h-8 w-8 text-muted-foreground";
  switch (key) {
    case 'ebitda':
      return <DollarSign className={iconClass} />;
    case 'burnRate':
      return <BarChart className={iconClass} />;
    case 'car':
      return <Users className={iconClass} />;
    case 'churnRate':
      return <PieChart className={iconClass} />;
    case 'grossMargin':
      return <Activity className={iconClass} />;
    case 'growthRate':
      return <Target className={iconClass} />;
    default:
      return <TrendingUp className={iconClass} />;
  }
} 