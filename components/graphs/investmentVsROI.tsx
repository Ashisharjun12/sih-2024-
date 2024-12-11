"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  YAxis,
  XAxis,
} from "recharts";

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
  ChartTooltip,
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

// Constants
const STARTUP_IDS = [
  "6755f5059fc6ad8a5d7b684e",
  "6755fb6dc8982ecb2e065854",
  "67585013f94081f029fbb6d6"
];
interface InvestmentData {
  month?: string;
  year?: string;
  data: Array<{
    investment: number;
    ROI: number;
  }>;
}

const chartConfig = {
  ROI: {
    label: "ROI",
  },
} satisfies ChartConfig;

export default function InvestmentVsROI() {
  const [selectedStartup, setSelectedStartup] = useState<string>(STARTUP_IDS[0]);
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchStartups=async()=>{
    try {
      setLoading(true);
      
    } catch (error) {
      
    }
  }

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
        // Transform API data for the chart
        const selectedStartupIndex = STARTUP_IDS.indexOf(selectedStartup);
        const transformedData = result.data.investmentVsROI.map((item: InvestmentData) => ({
          date: item[timeframe === 'monthly' ? 'month' : 'year'] || '',
          investment: item.data[selectedStartupIndex]?.investment || 0,
          ROI: item.data[selectedStartupIndex]?.ROI || 0
        }));

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
    fetchStartups();
    fetchData();
  }, [timeframe, selectedStartup]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Investment vs ROI</CardTitle>
          <CardDescription>Investment Return Analysis</CardDescription>
        </div>
        <div className="flex gap-4">
          <Select value={selectedStartup} onValueChange={setSelectedStartup}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a startup" />
            </SelectTrigger>
            <SelectContent>
              {STARTUP_IDS.map((id, index) => (
                <SelectItem key={id} value={id}>
                  {index === 0 ? "startup 0":(index === 1 ? "startup a": "startup b")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={(value: 'monthly' | 'yearly') => setTimeframe(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              dataKey="ROI"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}%`}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Investment
                          </span>
                          <span className="font-bold text-muted-foreground">
                            ₹{payload[0].payload.investment.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            ROI
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.ROI}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="ROI">
              <LabelList 
                position="top" 
                dataKey="ROI" 
                fillOpacity={1}
                formatter={(value: number) => `${value}%`}
              />
              {chartData.map((item) => (
                <Cell
                  key={item.date}
                  fill={
                    item.ROI > 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
