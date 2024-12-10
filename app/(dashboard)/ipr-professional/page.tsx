"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Shield,
  FileCheck,
  Search,
  FileText,
  ChevronRight,
  Users,
  Target,
  Building2
} from "lucide-react";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";

export default function IPRProfessionalPage() {
  const { data: session } = useSession();

  const stats = [
    {
      title: "Active Patents",
      value: "45",
      icon: Shield,
      color: "blue",
      description: "Patent applications"
    },
    {
      title: "Trademarks",
      value: "78",
      icon: FileCheck,
      color: "emerald",
      description: "Active cases"
    },
    {
      title: "Copyrights",
      value: "120",
      icon: Search,
      color: "violet",
      description: "Registered works"
    },
    {
      title: "Trade Secrets",
      value: "32",
      icon: FileText,
      color: "amber",
      description: "Protected assets"
    }
  ];

  const recentApplications = [
    {
      title: "Smart IoT Device",
      type: "Patent",
      status: "Under Review",
      date: "2024-03-15"
    },
    {
      title: "TechBrand Logo",
      type: "Trademark",
      status: "Approved",
      date: "2024-03-14"
    },
    {
      title: "Software Suite",
      type: "Copyright",
      status: "Pending",
      date: "2024-03-13"
    }
  ];

  return (
    <div className="container py-6 space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {session?.user?.name}! ✨
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Manage your intellectual property portfolio and track applications.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={cn(
            "bg-gradient-to-br rounded-xl p-4 md:p-6",
            stat.color === "blue" && "from-blue-500/10 via-blue-500/5 to-transparent",
            stat.color === "emerald" && "from-emerald-500/10 via-emerald-500/5 to-transparent",
            stat.color === "violet" && "from-violet-500/10 via-violet-500/5 to-transparent",
            stat.color === "amber" && "from-amber-500/10 via-amber-500/5 to-transparent"
          )}>
            <stat.icon className={cn(
              "h-6 w-6 mb-2",
              stat.color === "blue" && "text-blue-500",
              stat.color === "emerald" && "text-emerald-500",
              stat.color === "violet" && "text-violet-500",
              stat.color === "amber" && "text-amber-500"
            )} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={cn(
              "text-sm",
              stat.color === "blue" && "text-blue-600/70",
              stat.color === "emerald" && "text-emerald-600/70",
              stat.color === "violet" && "text-violet-600/70",
              stat.color === "amber" && "text-amber-600/70"
            )}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
          <Button
            variant="ghost"
            className="text-blue-500 hover:text-blue-600"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {recentApplications.map((app, index) => (
              <Card key={index} className="w-[300px] flex-none">
                <CardHeader>
                  <CardTitle className="text-lg">{app.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="text-sm font-medium">{app.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="text-sm font-medium">{app.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span className="text-sm font-medium">{app.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Fixed Mobile FAB */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 
            flex items-center justify-center transition-all duration-200
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)]"
        >
          <FileText className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
} 