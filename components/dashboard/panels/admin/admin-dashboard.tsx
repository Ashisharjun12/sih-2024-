"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Users,
  Building2,
  GraduationCap,
  Scale,
  FileText,
  Banknote,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStat {
  title: string;
  value: number;
  icon: any;
  description: string;
}

// Helper function for consistent number formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount).replace('₹', '₹');
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStat[]>([
    {
      title: "Total Users",
      value: 1234,
      icon: Users,
      description: "Active users on platform",
    },
    {
      title: "Startups",
      value: 156,
      icon: Building2,
      description: "Registered startups",
    },
    {
      title: "Researchers",
      value: 89,
      icon: GraduationCap,
      description: "Active researchers",
    },
    {
      title: "IPR Professionals",
      value: 45,
      icon: Scale,
      description: "Registered professionals",
    },
    {
      title: "Policy Makers",
      value: 23,
      icon: FileText,
      description: "Active policy makers",
    },
    {
      title: "Funding",
      value: 5000000,
      icon: Banknote,
      description: "Total funding facilitated",
    },
  ]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
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
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.title === "Funding" 
                    ? formatCurrency(stat.value)
                    : stat.value.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add recent activity content */}
        </CardContent>
      </Card>
    </div>
  );
} 