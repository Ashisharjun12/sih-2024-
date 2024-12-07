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
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { MetricData, TimeframeKey, MetricKey } from "@/types/metrics";
import { ChartConfigItem } from "@/types/chart-props";

const kpiConfig = {
  burnRate: {
    label: "Burn Rate (%)",
    color: "hsl(var(--chart-a))",
    format: (value: number) => `${value.toFixed(1)}%`
  },
  revenue: {
    label: "Revenue (₹L)",
    color: "hsl(var(--chart-b))",
    format: (value: number) => `₹${value}L`
  },
  customerAcquisition: {
    label: "Customer Acquisition Rate",
    color: "hsl(var(--chart-c))",
    format: (value: number) => value.toString()
  },
  grossMargin: {
    label: "Gross Margin (%)",
    color: "hsl(var(--chart-d))",
    format: (value: number) => `${value}%`
  },
  roi: {
    label: "Return on Investment (%)",
    color: "hsl(var(--chart-e))",
    format: (value: number) => `${value.toFixed(1)}%`
  }
} as const satisfies Record<MetricKey, ChartConfigItem>;

function ChartLegend({ kpi, color }: { kpi: string; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background/50 px-3 py-1.5">
      <div 
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color || 'currentColor' }}
      />
      <span className="text-xs font-medium">{kpi}</span>
    </div>
  );
}

interface KPIChartProps {
  startupId: string;
}

export function KPIChart({ startupId }: KPIChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeframeKey>("monthly");
  const [selectedKPI, setSelectedKPI] = useState<MetricKey>("burnRate");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MetricData | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/startup/metrics?timeframe=${timeFrame}&metric=${selectedKPI}&startupId=${startupId}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data.metrics[selectedKPI]);
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
  }, [timeFrame, selectedKPI]);

  const formatTooltip = (value: number) => {
    return kpiConfig[selectedKPI].format(value);
  };

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

  const getKPIDescription = () => {
    return timeFrame === "monthly" 
      ? `Monthly ${kpiConfig[selectedKPI].label} trend`
      : `Yearly ${kpiConfig[selectedKPI].label} analysis`;
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Key Performance Indicators
            </CardTitle>
            <CardDescription className="mt-1.5">
              {getKPIDescription()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select 
              value={selectedKPI} 
              onValueChange={(value: MetricKey) => setSelectedKPI(value)}
            >
              <SelectTrigger className="w-[180px] bg-background/50">
                <SelectValue placeholder="Select KPI" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(kpiConfig).map((kpi) => (
                  <SelectItem 
                    key={kpi} 
                    value={kpi as MetricKey}
                    className="hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: kpiConfig[kpi as MetricKey].color }}
                      />
                      {kpiConfig[kpi as MetricKey].label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={timeFrame} 
              onValueChange={(value: TimeframeKey) => setTimeFrame(value)}
            >
              <SelectTrigger className="w-[140px] bg-background/50">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ChartLegend 
            kpi={String(kpiConfig[selectedKPI].label)}
            color={kpiConfig[selectedKPI].color || 'currentColor'}
          />
          <div className="text-xs text-muted-foreground">
            {timeFrame === "monthly" ? "Last 12 months" : "Last 5 years"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer 
          config={kpiConfig} 
          className="w-full h-[300px]"
        >
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
              tickFormatter={formatTooltip}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {kpiConfig[selectedKPI].label}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {formatTooltip(payload[0].value as number)}
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
              stroke={kpiConfig[selectedKPI].color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default KPIChart;
