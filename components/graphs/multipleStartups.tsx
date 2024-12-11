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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Formatter } from "recharts/types/component/DefaultTooltipContent";

// Constants
const STARTUP_IDS = [
  "6755f5059fc6ad8a5d7b684e",
  "6755fb6dc8982ecb2e065854","67585013f94081f029fbb6d6"
];

interface StartupData {
  month?: string;
  year?: string;
  data: number[];
}

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

const MultipleStartups = () => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [startupNames, setStartupNames] = useState<string[]>([]);
  const { toast } = useToast();

  const chartConfig = {
    [startupNames[0] || "Loading..."]: {
      label: startupNames[0] || "Loading...",
      color: "hsl(var(--chart-1))",
    },
    [startupNames[1] || "Loading..."]: {
      label: startupNames[1] || "Loading...",
      color: "hsl(var(--chart-2))",
    },
    [startupNames[2] || "Loading..."]: {
      label: startupNames[2] || "Loading...",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const formatValue: Formatter<number | string, string> = (value) => {
    if (typeof value === 'number') {
      return `₹${value.toLocaleString()}`;
    }
    return value.toString();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/funding-agency/metrics?timeframe=${timeframe}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startupIds: STARTUP_IDS }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Get startup names from the API response
        const names = result.data.startupNames || [];
        setStartupNames(names);

        // Transform API data for the chart
        const transformedData = result.data.startupsData.map((timePoint: any) => {
          const dataPoint: ChartDataPoint = {
            date: timePoint[timeframe === 'monthly' ? 'month' : 'year'] || ''
          };

          // Add data for each startup
          timePoint.data.forEach((value: number, index: number) => {
            if (names[index]) {
              dataPoint[names[index]] = value;
            }
          });

          return dataPoint;
        });

        setChartData(transformedData);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch metrics data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
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
  }, [timeframe]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Startup Performance Comparison</CardTitle>
        <CardDescription>
          Compare performance metrics across startups
        </CardDescription>
        <Select value={timeframe} onValueChange={(value: 'monthly' | 'yearly') => setTimeframe(value)}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select timeframe"
          >
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full h-[400px]"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
            width={600}
            height={300}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent 
                formatter={formatValue}
              />} 
            />
            <defs>
              {Object.entries(chartConfig).map(([startup, config]) => (
                <linearGradient
                  key={startup}
                  id={`fill${startup.replace(/\s+/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            {Object.entries(chartConfig).map(([startup, config]) => (
              <Area
                key={startup}
                dataKey={startup}
                type="natural"
                fill={`url(#fill${startup.replace(/\s+/g, "")})`}
                fillOpacity={0.4}
                stroke={config.color}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MultipleStartups;