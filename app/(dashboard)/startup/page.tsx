"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  DollarSign,
  Plus,
  Wallet,
  ArrowUpRight,
  ChevronRight,
  Rocket,
  Users,
  Calendar,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sample project data - replace with API data
const projects = [
  {
    id: "1",
    title: "AI-Powered Analytics",
    status: "In Progress",
    progress: 65,
    team: 4,
    deadline: "2024-04-15",
    description: "Building an AI analytics platform for business intelligence.",
  },
  {
    id: "2",
    title: "Mobile App Development",
    status: "Planning",
    progress: 25,
    team: 3,
    deadline: "2024-05-20",
    description: "Developing a cross-platform mobile application.",
  },
];

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    status: string;
    progress: number;
    team: number;
    deadline: string;
    description: string;
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/startup/projects/${project.id}`)}
      className="cursor-pointer"
    >
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <Badge variant={
                project.status === "In Progress" ? "default" : 
                project.status === "Planning" ? "secondary" : 
                "outline"
              }>
                {project.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{project.team} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface QuickStatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
}

function QuickStatCard({ title, value, change, icon: Icon }: QuickStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                {change}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function StartupPage() {
  const router = useRouter();

  return (
    <div className="container py-6 space-y-8 relative">
      {/* Top Section with Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Text */}
        <div className="md:col-span-2 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Manage your projects and track your startup's progress
          </p>
        </div>

        {/* Wallet Card */}
        <Card className="bg-primary/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">₹24,500</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  +₹2,400 this month
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => router.push('/startup/projects')}
              variant="outline"
              className="md:hidden"
            >
              View All
            </Button>
            <Button 
              onClick={() => router.push('/startup/projects/createnewproject')}
              className="hidden md:flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard
          title="Total Earnings"
          value="₹148,560"
          change="+22.5%"
          icon={DollarSign}
        />
        <QuickStatCard
          title="Active Projects"
          value="4"
          change="+1 new"
          icon={Rocket}
        />
        <QuickStatCard
          title="Team Members"
          value="12"
          change="+3 this month"
          icon={Users}
        />
        <QuickStatCard
          title="Project Goals"
          value="8/10"
          change="80% achieved"
          icon={Target}
        />
      </div>

      {/* Floating Action Button - Fixed at bottom right */}
      <Button
        onClick={() => router.push('/startup/projects/createnewproject')}
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg md:bottom-8"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}