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
import { useState } from "react";
import { ChartProps } from "@/types/chart-props";

export default function GrossMargin() {
  const [timeFrame, setTimeFrame] = useState<TimeframeKey>("monthly");
  const [data, setData] = useState<MetricData | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const chartConfig = {
    "Startup A": {
      label: "Startup A",
      color: "hsl(var(--chart-1))",
    },
    "Startup B": {
      label: "Startup B",
      color: "hsl(var(--chart-2))",
    },
    "Startup C": {
      label: "Startup C",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const [timeRange, setTimeRange] = useState("90d");
  const filteredData = data?.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2023-04-03");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit per month</CardTitle>
        <CardDescription>
          Profit per month for the last 12 months
        </CardDescription>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full h-[200px]"
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
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
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
}
