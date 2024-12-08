"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Activity,
  PieChart,
  Target,
  ArrowUpRight,
  Users,
  BarChart,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ROIChart from '@/components/graphs/roi';
import KPIChart from "@/components/graphs/kpi";
import { CustomerAcquisitionRate } from "@/components/graphs/customerAcquisitionRate";

// Define valid timeframes
type ValidTimeframe = 'weekly' | 'monthly' | 'yearly';

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

function StartupDetails({ params }: { params: { id: string } }) {
  const [timeFrame, setTimeFrame] = useState<ValidTimeframe>('monthly');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TimeframedStats | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/startup/metrics?timeframe=${timeFrame}&startupId=${params.id}`
        );
        const data = await response.json();

        if (data.success) {
          setStats(data.data.stats);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch metrics data",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: "Error",
          description: "Failed to fetch metrics data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeFrame, params.id, toast]);

  // Format helpers
  const formatCurrency = (value: number): string => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const formatNumber = (value: number): string => 
    new Intl.NumberFormat('en-IN').format(value);

  const formatPercentage = (value: number): string => 
    `${value.toFixed(1)}%`;

  // Get formatted value based on stat type
  const getFormattedValue = (key: keyof TimeframedStats, value: number): string => {
    switch (key) {
      case 'revenue':
        return formatCurrency(value);
      case 'customerGrowth':
        return formatNumber(value);
      case 'burnRate':
        return `${formatCurrency(value)}/month`;
      case 'roi':
      case 'marketShare':
      case 'growthRate':
        return formatPercentage(value);
      default:
        return value.toString();
    }
  };

  // Get stat description
  const getStatDescription = (key: keyof TimeframedStats): string => {
    switch (key) {
      case 'revenue':
        return 'Total revenue generated';
      case 'customerGrowth':
        return 'New customers acquired';
      case 'burnRate':
        return 'Monthly cash burn rate';
      case 'roi':
        return 'Return on investment';
      case 'marketShare':
        return 'Market share percentage';
      case 'growthRate':
        return 'Overall growth rate';
      default:
        return '';
    }
  };

  // Get icon for stat
  const getStatIcon = (key: keyof TimeframedStats) => {
    const iconClass = "h-4 w-4 text-primary";
    switch (key) {
      case 'revenue':
        return <DollarSign className={iconClass} />;
      case 'customerGrowth':
        return <Users className={iconClass} />;
      case 'burnRate':
        return <Activity className={iconClass} />;
      case 'roi':
        return <TrendingUp className={iconClass} />;
      case 'marketShare':
        return <PieChart className={iconClass} />;
      case 'growthRate':
        return <BarChart className={iconClass} />;
      default:
        return <Target className={iconClass} />;
    }
  };

  if (loading || !stats) {
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
        {/* Header with Time Period Selection */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Business Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Track your startup's financial performance and market position
            </p>
          </div>
          <Select
            value={timeFrame}
            onValueChange={(value: ValidTimeframe) => setTimeFrame(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(stats) as Array<keyof TimeframedStats>).map((key, index) => {
            const stat = stats[key];
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
                      {getFormattedValue(key, stat.value)}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${textColorClass} flex items-center gap-1`}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                        <ArrowUpRight className={`h-3 w-3 ${!isPositive ? 'rotate-180' : ''}`} />
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

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <ROIChart startupId={params.id} />
          <KPIChart startupId={params.id} />
          <CustomerAcquisitionRate startupId={params.id} />
        </div>
      </div>
    </div>
  );
}

export default StartupDetails;