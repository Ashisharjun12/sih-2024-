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
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", burnRate: 5 },
  { month: "February", burnRate: 3 },
  { month: "March", burnRate: 8 },
  { month: "April", burnRate: 1 },
  { month: "May", burnRate: 9 },
  { month: "June", burnRate: 12 },
  { month: "July", burnRate: 10 },
  { month: "August", burnRate: 11 },
  { month: "September", burnRate: 13 },
  { month: "October", burnRate: 8 },
  { month: "November", burnRate: 15 },
  { month: "December", burnRate: 4 },
];

const chartConfig = {
  burnRate: {
    label: "Burn Rate",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BurnRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="burnRate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="burnRate"
              type="natural"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
