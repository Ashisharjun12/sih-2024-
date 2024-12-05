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
const chartData = [
  {
    name: "Startup A",
    data: [
      { investment: 10000, ROI: 12 },
      { investment: 15000, ROI: -5 },
      { investment: 20000, ROI: 10 },
      { investment: 25000, ROI: -8 },
      { investment: 30000, ROI: 18 },
      { investment: 35000, ROI: -2 },
      { investment: 40000, ROI: 20 },
      { investment: 45000, ROI: -12 },
      { investment: 50000, ROI: 22 },
      { investment: 55000, ROI: 15 },
      { investment: 60000, ROI: -10 },
      { investment: 65000, ROI: 8 },
    ],
  },
  {
    name: "Startup B",
    data: [
      { investment: 15000, ROI: -5 },
      { investment: 60000, ROI: -10 },
      { investment: 65000, ROI: 8 },
      { investment: 70000, ROI: 12 },
    ],
  },
  {
    name: "Startup C",
    data: [
      { investment: 15000, ROI: -5 },
      { investment: 60000, ROI: -10 },
      { investment: 65000, ROI: 8 },
      { investment: 70000, ROI: 12 },
    ],
  },
];

const chartConfig = {
  ROI: {
    label: "ROI",
  },
} satisfies ChartConfig;

export default function InvestmentVsROI() {
  const [selectedStartup, setSelectedStartup] = useState(chartData[0].name);
  const filteredData =
    chartData.find((item) => item.name === selectedStartup)?.data || [];

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Investment vs ROI</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
        <Select value={selectedStartup} onValueChange={setSelectedStartup} >
          <SelectTrigger>
            <SelectValue placeholder="Select a startup" />
          </SelectTrigger>
          <SelectContent>
            {chartData.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <BarChart accessibilityLayer data={filteredData}>
            <XAxis
              dataKey="investment"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              dataKey="ROI"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="ROI">
              <LabelList position="top" dataKey="ROI" fillOpacity={1} />
              {filteredData.map((item) => (
                <Cell
                  key={item.investment}
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
