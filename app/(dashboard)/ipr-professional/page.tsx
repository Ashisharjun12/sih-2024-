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
      color: "teal",
      description: "Patent applications"
    },
    {
      title: "Trademarks",
      value: "78",
      icon: FileCheck,
      color: "teal",
      description: "Active cases"
    },
    {
      title: "Copyrights",
      value: "120",
      icon: Search,
      color: "teal",
      description: "Protected works"
    },
    {
      title: "Trade Secrets",
      value: "32",
      icon: FileText,
      color: "teal",
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
      {/* Welcome Section with Teal Theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-950">
            Welcome back, {session?.user?.name}! ✨
          </h1>
          <p className="text-sm md:text-base text-teal-600 mt-2">
            Manage your intellectual property portfolio and track applications.
          </p>
        </div>
      </div>

      {/* Stats Grid with Teal Theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={cn(
            "bg-gradient-to-br rounded-xl p-4 md:p-6",
            "from-teal-500/10 via-teal-500/5 to-transparent hover:from-teal-500/15 hover:via-teal-500/10 transition-all duration-300"
          )}>
            <stat.icon className="h-6 w-6 mb-2 text-teal-600" />
            <p className="text-2xl font-bold text-teal-950">{stat.value}</p>
            <p className="text-sm text-teal-600/80">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Applications Section with Teal Theme */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-teal-950">Recent Applications</h2>
          <Button
            variant="ghost"
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {recentApplications.map((app, index) => (
              <Card 
                key={index} 
                className="w-[300px] flex-none hover:shadow-lg transition-all duration-300 border-teal-100"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-teal-900">{app.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-teal-600">Type:</span>
                      <span className="text-sm font-medium text-teal-700">{app.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-teal-600">Status:</span>
                      <span className="text-sm font-medium text-teal-700">{app.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-teal-600">Date:</span>
                      <span className="text-sm font-medium text-teal-700">{app.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Fixed Mobile FAB with Teal Theme */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          className="h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-500 
            flex items-center justify-center transition-all duration-200
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(20,184,166,0.3)]"
        >
          <FileText className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}