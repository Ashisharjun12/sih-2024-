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
import { KPIChart } from "@/components/graphs/kpi";

export default function StartupMetrics() {
  const [timeFrame, setTimeFrame] = useState<TimeframeKey>("monthly");
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [startupId, setStartupId] = useState<string>('default');
  const { toast } = useToast();

  useEffect(() => {
    const fetchStartupId = async () => {
      try {
        const res = await fetch('/api/startup/profile');
        const data = await res.json();
        if (data.profile?._id) {
          setStartupId(data.profile._id);
        }
      } catch (error) {
        console.error('Error fetching startup ID:', error);
      }
    };

    fetchStartupId();
  }, []);

  const fetchMetricsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/startup/metrics?timeframe=${timeFrame}&startupId=${startupId}`
      );
      const result = await response.json();

      if (result.success) {
        setMetricsData(result.data);
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
    fetchMetricsData();
  }, [fetchMetricsData]);

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

  const fetchMetric = async (metricKey: string) => {
    try {
      const response = await fetch(
        `/api/startup/metrics?timeframe=${timeFrame}&startupId=${startupId}&metric=${metricKey}`
      );
      const result = await response.json();

      if (result.success) {
        setMetricsData(prev => prev ? {
          ...prev,
          metrics: {
            ...prev.metrics,
            [metricKey]: result.data.metrics[metricKey]
          }
        } : null);
      }
    } catch (error) {
      console.error(`Error fetching ${metricKey} metric:`, error);
    }
  };

  const changeStartup = async (newStartupId: string) => {
    setStartupId(newStartupId);
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
              onValueChange={changeStartup}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select startup" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup-1">AI/ML Startup</SelectItem>
                <SelectItem value="startup-2">Early Stage Startup</SelectItem>
                <SelectItem value="startup-3">Growth Stage Startup</SelectItem>
                <SelectItem value="startup-4">SaaS Startup</SelectItem>
                <SelectItem value="startup-5">Hardware Startup</SelectItem>
                <SelectItem value="default">Demo Startup</SelectItem>
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
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(metricsData.stats).map(([key, stat], index) => {
            const isNegativeGood = key === 'burnRate' || key === 'churnRate';
            const isPositive = stat.change > 0;
            const changeColor = isNegativeGood
              ? (isPositive ? 'text-red-500' : 'text-green-500')
              : (isPositive ? 'text-green-500' : 'text-red-500');

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => fetchMetric(key)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <h3 className="text-2xl font-bold">
                          {formatStatValue(key, stat.value)}
                        </h3>
                        <p className={`text-xs flex items-center gap-1 ${changeColor}`}>
                          <TrendingUp 
                            className={`h-3 w-3 ${stat.change < 0 ? 'rotate-180' : ''}`} 
                          />
                          {stat.change > 0 ? '+' : ''}{stat.change}%
                          <span className="text-muted-foreground ml-1">
                            {getStatDescription(key)}
                          </span>
                        </p>
                      </div>
                      {getStatIcon(key)}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Revenue />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BurnRate />
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
            <GrossMargin />
          </motion.div>

          {/* Market Analysis Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metricsData.marketAnalysis.currentPerformance).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-48 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <KPIChart startupId={startupId} />
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