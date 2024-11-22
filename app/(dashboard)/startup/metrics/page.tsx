"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  LineChart,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart,
  PieChart,
  Target,
  ArrowUpRight,
} from "lucide-react";
import {
  Line,
  Bar,
  Doughnut,
  Radar,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function StartupMetrics() {
  const [timeFrame, setTimeFrame] = useState('monthly');

  // Dynamic data based on timeFrame
  const getEbitdaData = (period: string) => {
    switch(period) {
      case 'weekly':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'EBITDA (₹ Lakhs)',
              data: [2.1, 2.3, 2.0, 2.5],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false,
            },
            {
              label: 'Target',
              data: [2.0, 2.2, 2.4, 2.6],
              borderColor: 'rgba(255, 99, 132, 0.5)',
              borderDash: [5, 5],
              tension: 0.1,
              fill: false,
            }
          ],
        };
      case 'monthly':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'EBITDA (₹ Lakhs)',
              data: [5.2, 5.8, 5.5, 6.2, 6.8, 6.5, 7.1, 7.4, 7.8, 8.2, 8.5, 9.0],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false,
            },
            {
              label: 'Target',
              data: [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.5],
              borderColor: 'rgba(255, 99, 132, 0.5)',
              borderDash: [5, 5],
              tension: 0.1,
              fill: false,
            }
          ],
        };
      case 'yearly':
        return {
          labels: ['2019', '2020', '2021', '2022', '2023'],
          datasets: [
            {
              label: 'EBITDA (₹ Lakhs)',
              data: [45.0, 52.0, 63.0, 75.0, 89.0],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false,
            },
            {
              label: 'Target',
              data: [40.0, 50.0, 60.0, 70.0, 85.0],
              borderColor: 'rgba(255, 99, 132, 0.5)',
              borderDash: [5, 5],
              tension: 0.1,
              fill: false,
            }
          ],
        };
      default:
        return {
          labels: [],
          datasets: [],
        };
    }
  };

  // MoU Status Data
  const mouData = {
    labels: ['Signed', 'In Progress', 'Under Review', 'Completed', 'Renewed'],
    datasets: [
      {
        label: 'MoUs',
        data: [12, 8, 5, 15, 7],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
      },
    ],
  };

  // Market Analysis Data
  const marketAnalysisData = {
    labels: ['Market Share', 'Growth Rate', 'Customer Satisfaction', 'Innovation Index', 'Brand Value', 'Competitive Edge'],
    datasets: [
      {
        label: 'Current Performance',
        data: [75, 82, 90, 85, 70, 88],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Industry Average',
        data: [65, 70, 75, 68, 72, 70],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  // Revenue Streams Data
  const revenueStreamsData = {
    labels: ['Product Sales', 'Services', 'Subscriptions', 'Licensing', 'Partnerships'],
    datasets: [
      {
        label: 'Revenue Distribution (%)',
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const stats = [
    {
      title: "EBITDA",
      value: "₹9.0L",
      change: "+15%",
      icon: DollarSign,
    },
    {
      title: "Active MoUs",
      value: "47",
      change: "+8",
      icon: Target,
    },
    {
      title: "Market Share",
      value: "12.5%",
      change: "+2.3%",
      icon: PieChart,
    },
    {
      title: "Growth Rate",
      value: "28%",
      change: "+5%",
      icon: TrendingUp,
    },
  ];

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
            onValueChange={setTimeFrame}
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <StatIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                      {stat.change}
                      <ArrowUpRight className="h-3 w-3" />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* EBITDA Trends */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                EBITDA Trends
              </CardTitle>
              <Select
                value={timeFrame}
                onValueChange={setTimeFrame}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Line 
                data={getEbitdaData(timeFrame)}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* MoU Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                MoU Status
              </CardTitle>
              <Select
                value={timeFrame}
                onValueChange={setTimeFrame}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Bar 
                data={mouData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Market Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Radar 
                data={marketAnalysisData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    r: {
                      min: 0,
                      max: 100,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Revenue Streams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Revenue Streams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Doughnut 
                data={revenueStreamsData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'right' },
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 