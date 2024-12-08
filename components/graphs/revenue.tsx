"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { MetricData, TimeframeKey } from "@/types/metrics";

interface ChartDataPoint {
  label: string;
  value: number;
  expenses?: number;
}

interface RevenueProps {
  startupId: string;
}

export default function Revenue({ startupId }: RevenueProps) {
  const [timeFrame, setTimeFrame] = useState<TimeframeKey>("monthly");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MetricData | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const { toast } = useToast();

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-2))",
    }
  } satisfies ChartConfig;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/startup/metrics?timeframe=${timeFrame}&metric=revenue&startupId=${startupId}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data.metrics.revenue);
        setLabels(result.data.labels);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch metrics data",
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
  };

  useEffect(() => {
    fetchData();
  }, [timeFrame, startupId]);

  // Format data for the chart
  const chartData = useMemo(() => {
    if (!data || !labels) return [];
    return labels.map((label, index) => ({
      label,
      value: data.value?.[index] || 0,
      expenses: data.expenses?.[index] || 0
    }));
  }, [data, labels]);

  if (loading || !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analysis</CardTitle>
        <CardDescription>
          Revenue and expenses over time
        </CardDescription>
        <Select 
          value={timeFrame} 
          onValueChange={(value: TimeframeKey) => setTimeFrame(value)}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full h-[300px]"
        >
          <AreaChart
            data={chartData}
            margin={{ left: 40, right: 40, top: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => `₹${value}L`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Revenue
                        </span>
                        <span className="font-bold text-muted-foreground">
                          ₹{payload[0].value}L
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Expenses
                        </span>
                        <span className="font-bold text-muted-foreground">
                          ₹{payload[1].value}L
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartConfig.revenue.color}
              fill={chartConfig.revenue.color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={chartConfig.expenses.color}
              fill={chartConfig.expenses.color}
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
