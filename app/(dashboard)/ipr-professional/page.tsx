"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Shield, 
  FileCheck, 
  Search,
  ChevronRight,
  Scale,
  GraduationCap,
  Globe,
  FileText
} from "lucide-react";

export default function IPRProfessionalDashboard() {
  const { data: session } = useSession();

  const stats = [
    {
      title: "Active Patents",
      value: "45",
      icon: Shield,
      description: "Patents under review"
    },
    {
      title: "Trademarks",
      value: "78",
      icon: FileCheck,
      description: "Active trademark cases"
    },
    {
      title: "IP Searches",
      value: "120",
      icon: Search,
      description: "Completed searches"
    },
    {
      title: "Compliance Rate",
      value: "95%",
      icon: Scale,
      description: "Overall compliance"
    }
  ];

  const quickActions = [
    {
      title: "Review Applications",
      description: "Review pending patent applications",
      icon: FileText,
      href: "/ipr-professional/patents"
    },
    {
      title: "IP Education",
      description: "Access educational resources",
      icon: GraduationCap,
      href: "/ipr-professional/education"
    },
    {
      title: "Global IP Status",
      description: "Check international IP status",
      icon: Globe,
      href: "/ipr-professional/global"
    },
    {
      title: "Legal Documents",
      description: "Manage legal documentation",
      icon: FileCheck,
      href: "/ipr-professional/documents"
    }
  ];

  return (
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
            Here's an overview of your IPR activities and tasks
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {<action.icon className="h-6 w-6 text-primary" />}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-2 w-full justify-between"
                    >
                      Get Started
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add your recent activity items here */}
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 