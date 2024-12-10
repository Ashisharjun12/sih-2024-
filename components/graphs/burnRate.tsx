"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
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
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { MetricData, TimeframeKey } from "@/types/metrics";

// Define chart configuration
const chartConfig = {
  actual: {
    label: "Actual Burn Rate",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target Burn Rate",
    color: "hsl(var(--chart-2))",
  }
};

// Legend component
function ChartLegend({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background/50 px-3 py-1.5">
      <div 
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

interface BurnRateProps {
  startupId: string;
}

export function BurnRate({ startupId }: BurnRateProps) {
  const [timeFrame, setTimeFrame] = useState<TimeframeKey>("monthly");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MetricData | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/startup/metrics?timeframe=${timeFrame}&metric=burnRate&startupId=${startupId}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data.metrics.burnRate);
        setLabels(result.data.labels);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch burn rate data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching burn rate data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch burn rate data",
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
      target: data.target?.[index] || 0
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
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Burn Rate Analysis
            </CardTitle>
            <CardDescription className="mt-1.5">
              {timeFrame === "monthly" 
                ? "Monthly burn rate vs targets"
                : "Year-over-year burn rate analysis"}
            </CardDescription>
          </div>
          <Select 
            value={timeFrame} 
            onValueChange={(value: TimeframeKey) => setTimeFrame(value)}
          >
            <SelectTrigger
              className="w-[160px] rounded-lg bg-background/50"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ChartLegend 
            label="Actual Burn Rate"
            color={chartConfig.actual.color}
          />
          <ChartLegend 
            label="Target Burn Rate"
            color={chartConfig.target.color}
          />
          <div className="text-xs text-muted-foreground">
            {timeFrame === "monthly" ? "Last 12 months" : "Last 5 years"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <LineChart
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
              tickFormatter={(value) => `₹${value}K`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Actual Burn Rate
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {`₹${payload[0].value}K`}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Target Burn Rate
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {`₹${payload[1].value}K`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartConfig.actual.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke={chartConfig.target.color}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BurnRate;
