"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MetricsData, TimeframeKey } from "@/types/metrics";
import { ROIChart } from "@/components/graphs/roi";
import { KPIChart } from "@/components/graphs/kpi";
import { CustomerAcquisitionRate } from "@/components/graphs/customerAcquisitionRate";
import { BurnRate } from "@/components/graphs/burnRate";
import Revenue from "@/components/graphs/revenue";
import GrossMargin from "@/components/graphs/grossMargin";

interface StartupMetricsProps {
  startupId: string;
}

export function StartupMetrics({ startupId }: StartupMetricsProps) {
  const [timeFrame, setTimeFrame] = useState<TimeframeKey>("monthly");
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const { toast } = useToast();

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

  const handleTimeFrameChange = useCallback((newTimeFrame: TimeframeKey) => {
    setTimeFrame(newTimeFrame);
  }, []);

  if (loading || !metricsData) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Period Selection */}
      <div className="flex justify-end">
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(metricsData.stats).map(([key, stat], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()=== "burn Rate" ? "Burn" : key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <h3 className="text-2xl font-bold">
                      {key.replace(/([A-Z])/g, ' $1').trim()==="revenue" || key.replace(/([A-Z])/g, ' $1').trim()==="burn Rate" ? '₹  ' : ''}{stat.value}
                      {key.replace(/([A-Z])/g, ' $1').trim()==="roi" || key.replace(/([A-Z])/g, ' $1').trim()==="market Share" || key.replace(/([A-Z])/g, ' $1').trim()==="growth Rate" ? '%' : ''}
                      <span className="text-xs">{"   "}{key.replace(/([A-Z])/g, ' $1').trim()==="customer Growth" ? 'customers' : ''}</span>
                    </h3>
                    <p className={`text-xs ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <ROIChart startupId={startupId} />
        <KPIChart startupId={startupId} />
        <CustomerAcquisitionRate startupId={startupId} />
        <Revenue startupId={startupId} />
        <BurnRate startupId={startupId} />
        <GrossMargin startupId={startupId} />
      </div>
    </div>
  );
} 