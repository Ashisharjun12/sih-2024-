"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DollarSign,
  Building2,
  TrendingUp,
  ChevronRight,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

interface Investment {
  startupName: string;
  amount: number;
  date: string;
  status: string;
  roi: number;
}

interface Recommendation {
  name: string;
  type: "Startup" | "Research";
  description: string;
  matchScore: number;
  sector: string;
}

interface StartupShowcase {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  userImage: string;
  sector: string;
  stage: string;
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function FundingAgencyDashboard() {
  const { data: session } = useSession();

  // Sample data for investments
  const investments: Investment[] = [
    {
      startupName: "TechCo",
      amount: 500000,
      date: "2024-01-15",
      status: "Active",
      roi: 15.5,
    },
    {
      startupName: "HealthInnovate",
      amount: 750000,
      date: "2024-02-01",
      status: "Active",
      roi: 12.8,
    },
    {
      startupName: "EduTech",
      amount: 300000,
      date: "2024-02-15",
      status: "Active",
      roi: 18.2,
    },
  ];

  // Sample recommendations
  const recommendations: Recommendation[] = [
    {
      name: "AI Solutions Inc",
      type: "Startup",
      description: "AI-powered business automation solutions",
      matchScore: 92,
      sector: "Technology",
    },
    {
      name: "Quantum Computing Research",
      type: "Research",
      description: "Breakthrough in quantum computing algorithms",
      matchScore: 88,
      sector: "Technology",
    },
    {
      name: "GreenTech Solutions",
      type: "Startup",
      description: "Sustainable energy solutions",
      matchScore: 85,
      sector: "CleanTech",
    },
  ];

  const roiChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "ROI %",
        data: [12, 15, 14, 16, 18, 17],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const investmentDistributionData = {
    labels: ["Technology", "Healthcare", "Education", "Finance"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(75, 192, 192)",
          "rgb(255, 206, 86)",
          "rgb(255, 99, 132)",
        ],
      },
    ],
  };

  const startups: StartupShowcase[] = [
    {
      id: "1",
      name: "TechCo Innovation",
      description: "AI-powered business automation solutions for enterprise",
      coverImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
      userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      sector: "Technology",
      stage: "Series A",
    },
    {
      id: "2",
      name: "HealthInnovate",
      description: "Revolutionary healthcare diagnostics platform",
      coverImage:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      sector: "Healthcare",
      stage: "Seed",
    },
    {
      id: "3",
      name: "EduTech Solutions",
      description: "Next-generation learning management system",
      coverImage:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7",
      userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      sector: "Education",
      stage: "Pre-seed",
    },
    // Add more startups as needed
  ];

  return (
    <>
      {/* Navigation Bar */}
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-semibold">Funding Agency Dashboard</div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-auto">
                  <div className="p-4 text-sm text-muted-foreground">
                    No new notifications
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="flex flex-col gap-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl font-bold">
              Welcome back, {session?.user?.name}
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's an overview of your investment portfolio and activities
            </p>
          </motion.div>

          {/* Portfolio Startups */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Portfolio Startups</h2>
              <Button variant="outline">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {startups.map((startup) => (
                <div
                  key={startup.id}
                  className="group relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Background Cover Image */}
                  <div className="relative h-64 w-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${startup.coverImage})` }}
                    >
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* User Image */}
                    <div className="absolute top-6 right-6">
                      <div className="h-16 w-16 rounded-full border-2 border-white overflow-hidden">
                        <img
                          src={startup.userImage}
                          alt={startup.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Startup Info */}
                    <div className="text-white">
                      <h3 className="font-semibold text-xl mb-2">
                        {startup.name}
                      </h3>
                      <p className="text-base text-white/80 line-clamp-2 mb-3">
                        {startup.description}
                      </p>
                      <div className="flex gap-3">
                        <Badge
                          variant="outline"
                          className="text-white border-white/30 text-sm py-1"
                        >
                          {startup.sector}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-white border-white/30 text-sm py-1"
                        >
                          {startup.stage}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="shadow-lg"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio and ROI Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* ROI Trend */}
            <Card>
              <CardHeader>
                <CardTitle>ROI Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <Line
                    data={roiChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function (value) {
                              return value + "%";
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Investment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <Doughnut
                    data={investmentDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right" as const,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Investments */}
          <Card>
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.map((investment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {investment.startupName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Invested: ₹{investment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">ROI</p>
                        <div className="flex items-center gap-1">
                          {investment.roi > 15 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={
                              investment.roi > 15
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {investment.roi}%
                          </span>
                        </div>
                      </div>
                      <Badge>{investment.status}</Badge>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{rec.name}</h3>
                            <Badge variant="outline" className="mt-1">
                              {rec.type}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {rec.matchScore}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rec.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{rec.sector}</Badge>
                          <Button variant="ghost" size="sm">
                            Learn More
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
