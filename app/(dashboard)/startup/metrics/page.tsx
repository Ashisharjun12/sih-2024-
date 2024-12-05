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
  Users,
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

// Demo data for one year (2023)
const yearlyData = {
  roi: {
    actual: [15.2, 16.8, 17.5, 18.2, 19.8, 21.5, 22.1, 23.4, 24.8, 25.2, 26.5, 28.0],
    target: [15.0, 16.5, 18.0, 19.5, 21.0, 22.5, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0]
  },
  kpi: {
    'Burn Rate': [3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9],
    'Revenue': [15, 17, 19, 22, 24, 26, 28, 30, 32, 35, 38, 40],
    'CAR': [82, 85, 88, 90, 93, 95, 98, 100, 103, 105, 108, 110],
    'Gross Margin': [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    'Churn Rate': [3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9]
  },
  customerMetrics: {
    acquisition: [850, 920, 980, 1050, 1120, 1200, 1280, 1350, 1420, 1500, 1580, 1650],
    churnRate: [2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7]
  },
  financialMetrics: {
    revenue: [150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315],
    expenses: [120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175]
  }
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Update getRoiData to use yearlyData
const getRoiData = () => ({
  labels: months,
  datasets: [
    {
      label: 'ROI (%)',
      data: yearlyData.roi.actual,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false,
    },
    {
      label: 'Target',
      data: yearlyData.roi.target,
      borderColor: 'rgba(255, 99, 132, 0.5)',
      borderDash: [5, 5],
      tension: 0.1,
      fill: false,
    }
  ],
});

const getKpiData = (metric: string) => ({
  labels: months,
  datasets: [
    {
      label: metric,
      data: yearlyData.kpi[metric as keyof typeof yearlyData.kpi],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false,
    }
  ],
});

const getCustomerMetricsData = () => ({
  labels: months,
  datasets: [
    {
      label: 'Customer Acquisition',
      data: yearlyData.customerMetrics.acquisition,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Churn Rate (%)',
      data: yearlyData.customerMetrics.churnRate,
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ],
});

const getFinancialMetricsData = () => ({
  labels: months,
  datasets: [
    {
      label: 'Revenue (₹L)',
      data: yearlyData.financialMetrics.revenue,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Expenses (₹L)',
      data: yearlyData.financialMetrics.expenses,
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ],
});

export default function StartupMetrics() {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [selectedKpi, setSelectedKpi] = useState('Burn Rate');

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

  // Add new metrics data
  const stats = [
    {
      title: "EBITDA",
      value: "₹9.0L",
      change: "+15%",
      icon: DollarSign,
    },
    {
      title: "Monthly Burn Rate",
      value: "₹2.5L",
      change: "-8%", // Negative is good for burn rate
      icon: TrendingUp,
    },
    {
      title: "CAR",
      value: "125",
      change: "+12%",
      icon: Target,
    },
    {
      title: "Churn Rate",
      value: "2.3%",
      change: "-0.5%", // Negative is good for churn
      icon: Activity,
    },
    {
      title: "Gross Margin",
      value: "68%",
      change: "+5%",
      icon: PieChart,
    },
    {
      title: "Growth Rate",
      value: "28%",
      change: "+5%",
      icon: TrendingUp,
    },
  ];

  // Add customer metrics data
  const getCustomerMetricsData = (period: string) => {
    switch(period) {
      case 'monthly':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Customer Acquisition Rate',
              data: [85, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Churn Rate (%)',
              data: [2.8, 2.6, 2.5, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true,
            }
          ],
        };
      // Add cases for weekly and yearly...
      default:
        return { labels: [], datasets: [] };
    }
  };

  // Add financial metrics data
  const getFinancialMetricsData = (period: string) => {
    switch(period) {
      case 'monthly':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Burn Rate (₹L)',
              data: [3.0, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Gross Margin (%)',
              data: [60, 62, 63, 65, 66, 68, 69, 70, 71, 72, 73, 74],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4,
              fill: true,
            }
          ],
        };
      // Add cases for weekly and yearly...
      default:
        return { labels: [], datasets: [] };
    }
  };

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

        {/* Updated Stats Grid - now 2x3 */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            const isNegativeGood = stat.title === "Burn Rate" || stat.title === "Churn Rate";
            const isPositive = stat.change.startsWith('+');
            const textColorClass = isNegativeGood 
              ? (!isPositive ? 'text-green-600' : 'text-red-600')
              : (isPositive ? 'text-green-600' : 'text-red-600');

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <StatIcon className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className={`text-xs ${textColorClass} flex items-center gap-1`}>
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
          {/* ROI Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Return on Investment (ROI)
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
                data={getRoiData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Return on Investment (%)',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      },
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: timeFrame === 'weekly' ? 'Weeks' : 
                              timeFrame === 'monthly' ? 'Months' : 'Years',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* KPI Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Key Performance Indicators
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedKpi}
                  onValueChange={setSelectedKpi}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Burn Rate">Burn Rate</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="CAR">CAR</SelectItem>
                    <SelectItem value="Gross Margin">Gross Margin</SelectItem>
                    <SelectItem value="Churn Rate">Churn Rate</SelectItem>
                  </SelectContent>
                </Select>
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
              </div>
            </CardHeader>
            <CardContent>
              <Line 
                data={getKpiData(selectedKpi)}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: selectedKpi === 'Revenue' ? 'Amount (₹L)' : 
                              selectedKpi.includes('Rate') ? 'Percentage (%)' : 
                              'Count',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: timeFrame === 'weekly' ? 'Weeks' : 
                              timeFrame === 'monthly' ? 'Months' : 'Years',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Customer Metrics Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Metrics
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
                data={getCustomerMetricsData(timeFrame)}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Customers / Churn Rate (%)',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: timeFrame === 'weekly' ? 'Weeks' : 
                              timeFrame === 'monthly' ? 'Months' : 'Years',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Financial Metrics Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Metrics
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
                data={getFinancialMetricsData(timeFrame)}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount (₹L) / Percentage (%)',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: timeFrame === 'weekly' ? 'Weeks' : 
                              timeFrame === 'monthly' ? 'Months' : 'Years',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    }
                  }
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
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of MoUs',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'MoU Status',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        padding: 10
                      }
                    }
                  }
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