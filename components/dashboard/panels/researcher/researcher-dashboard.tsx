"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Brain,
  Trophy,
  Users,
  Wallet,
  ArrowUpRight,
  ChevronRight,
  Target,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";

const researchCards = [
  {
    title: "AI in Healthcare",
    status: "In Progress",
    progress: 75,
    collaborators: [
      { name: "Sarah K", image: "/avatars/1.png" },
      { name: "Mike R", image: "/avatars/2.png" },
      { name: "Anna M", image: "/avatars/3.png" },
    ],
    category: "Artificial Intelligence",
    color: "from-blue-500 to-cyan-500",
    dueDate: "2024-05-15",
    priority: "High",
  },
  {
    title: "Quantum Computing",
    status: "Review",
    progress: 90,
    collaborators: [
      { name: "John D", image: "/avatars/4.png" },
      { name: "Lisa P", image: "/avatars/5.png" },
    ],
    category: "Computing",
    color: "from-purple-500 to-pink-500",
    dueDate: "2024-06-20",
    priority: "Medium",
  },
  {
    title: "Green Energy",
    status: "Planning",
    progress: 30,
    collaborators: [
      { name: "Tom H", image: "/avatars/6.png" },
      { name: "Emma S", image: "/avatars/7.png" },
    ],
    category: "Sustainability",
    color: "from-green-500 to-emerald-500",
    dueDate: "2024-07-01",
    priority: "High",
  },
];

export default function ResearcherDashboard() {
  const { session, status } = useRoleGuard("researcher");
  const { toast } = useToast();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4 space-y-6">
      {/* Welcome Section with Profile */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 rounded-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name}!</h1>
          <p className="text-sm text-muted-foreground">Your research impact dashboard</p>
        </div>
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar>
      </div>

      {/* Wallet Cards with 3D effect */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ translateY: -5 }} transition={{ duration: 0.2 }}>
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/0 hover:shadow-lg hover:shadow-primary/20 transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Research Funds</p>
                  <p className="text-2xl font-bold">₹24,500</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12.5%
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl rotate-3">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ translateY: -5 }} transition={{ duration: 0.2 }}>
          <Card className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-purple-500/0 hover:shadow-lg hover:shadow-purple-500/20 transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Citations</p>
                  <p className="text-2xl font-bold">1,234</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
                      <Star className="h-3 w-3 mr-1" />
                      Top 5%
                    </Badge>
                    <span className="text-xs text-muted-foreground">in your field</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl -rotate-3">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats with Hover Effects */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Brain, title: "Projects", value: "12", color: "blue" },
          { icon: Users, title: "Collaborators", value: "45", color: "green" },
          { icon: Trophy, title: "Publications", value: "8", color: "amber" },
          { icon: Target, title: "Goals Met", value: "92%", color: "rose" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`bg-gradient-to-br from-${stat.color}-500/10 via-${stat.color}-500/5 to-${stat.color}-500/0 hover:shadow-lg transition-all`}>
              <CardContent className="p-4 text-center">
                <div className={`mx-auto w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-3 rotate-3`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Research Projects with Enhanced Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Active Research</h2>
            <p className="text-sm text-muted-foreground">Your ongoing research projects</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </Button>
        </div>

        <div className="grid gap-4">
          {researchCards.map((research, index) => (
            <motion.div
              key={research.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className={`h-1.5 bg-gradient-to-r ${research.color}`} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">{research.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {research.category}
                        </Badge>
                        <Badge 
                          variant={research.priority === "High" ? "destructive" : "outline"}
                          className="text-xs"
                        >
                          {research.priority} Priority
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Due {new Date(research.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        research.status === "In Progress" ? "default" :
                        research.status === "Review" ? "secondary" : "outline"
                      }
                    >
                      {research.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{research.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${research.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${research.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {research.collaborators.map((collaborator, i) => (
                          <Avatar key={i} className="border-2 border-background w-8 h-8">
                            <AvatarImage src={collaborator.image} />
                            <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 