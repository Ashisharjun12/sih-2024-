"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Users,
  Target,
  TrendingUp,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  Star,
  Building2,
  Clock,
  Briefcase,
  Plus,
  Sparkles,
  Zap,
  Leaf,
  Heart,
  Banknote,
  Globe,
  type LucideIcon,
} from "lucide-react";
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StartupData {
  _id: string;
  startupDetails: {
    startupName: string;
    startupLogo?: {
      secure_url: string;
    };
    about: string;
    industries: string[];
    stage: string;
  };
  businessActivities: {
    missionAndVision: string;
  };
  additionalInfo?: {
    website?: string;
  };
}

interface TrendingStartup {
  name: string;
  category: string;
  growth: string;
  color: string;
  icon: LucideIcon;
}

const trendingStartups: TrendingStartup[] = [
  {
    name: "Tech Innovators",
    category: "AI & ML",
    growth: "+45%",
    color: "blue",
    icon: Zap
  },
  {
    name: "Green Solutions",
    category: "CleanTech",
    growth: "+38%",
    color: "green",
    icon: Leaf
  },
  {
    name: "HealthTech Pro",
    category: "Healthcare",
    growth: "+52%",
    color: "rose",
    icon: Heart
  },
  {
    name: "FinTech Plus",
    category: "Finance",
    growth: "+41%",
    color: "amber",
    icon: Banknote
  },
];

export default function StartupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await fetch("/api/startup/projects");
      const data = await response.json();
      if (data.success) {
        setStartups(data.startups);
      }
    } catch (error) {
      console.error("Error fetching startups:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "₹1.2M",
      change: "+12.3%",
      icon: TrendingUp,
      color: "blue"
    },
    {
      title: "Team Size",
      value: "12",
      change: "+3 this month",
      icon: Users,
      color: "green"
    },
    {
      title: "Goals Met",
      value: "89%",
      change: "On track",
      icon: Target,
      color: "amber"
    },
    {
      title: "Projects",
      value: "8",
      change: "Active now",
      icon: Briefcase,
      color: "purple"
    }
  ];

  return (
    <div className="container py-4 space-y-6">
      {/* Welcome Section with Calming Blue Theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent p-6">
        <div className="absolute inset-0 bg-grid-white/10 backdrop-blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
            Welcome back, {session?.user?.name}! ✨
          </h1>
          <p className="text-sm md:text-base text-muted-foreground/80 mt-2">
            Your startup journey continues. Let's make progress today!
          </p>
        </div>
      </div>

      {/* Finance Cards - Keep existing code but update gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ translateY: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-emerald-300/5 to-transparent hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-emerald-500" />
                    <p className="text-sm font-medium text-muted-foreground">Available Funds</p>
                  </div>
                  <p className="text-3xl font-bold mt-2">₹84,550</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      18.2%
                    </Badge>
                    <span className="text-xs text-muted-foreground">Monthly growth</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ rotate: 12 }}
                  className="p-3 bg-emerald-500/10 rounded-xl"
                >
                  <Sparkles className="h-6 w-6 text-emerald-500" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ translateY: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-500/20 via-indigo-400/5 to-transparent hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <p className="text-sm font-medium text-muted-foreground">Growth Score</p>
                  </div>
                  <p className="text-3xl font-bold mt-2">92.4</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
                      <Star className="h-3 w-3 mr-1" />
                      Top 10%
                    </Badge>
                    <span className="text-xs text-muted-foreground">in your sector</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ rotate: -12 }}
                  className="p-3 bg-blue-500/10 rounded-xl"
                >
                  <Rocket className="h-6 w-6 text-blue-500" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stats Grid - Keep existing code */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className={`bg-gradient-to-br from-${stat.color}-500/10 via-${stat.color}-500/5 to-transparent hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-4">
                <div className={`mx-auto w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-3 transform rotate-3`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mobile Trending Section */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Trending Startups</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {trendingStartups.map((trend, index) => (
              <motion.div
                key={trend.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-[280px] flex-shrink-0"
              >
                <Card className="bg-gradient-to-br from-background to-background/80 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl bg-${trend.color}-500/10`}>
                        <trend.icon className={`h-5 w-5 text-${trend.color}-500`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{trend.name}</h3>
                        <p className="text-xs text-muted-foreground">{trend.category}</p>
                      </div>
                      <Badge className={`bg-${trend.color}-500/10 text-${trend.color}-500`}>
                        {trend.growth}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Updated Startup Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Your Startups</h2>
            <p className="text-sm text-muted-foreground">Manage your ventures</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {startups.map((startup, index) => (
            <motion.div
              key={startup._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer group"
              onClick={() => router.push(`/startup/projects/${startup._id}`)}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500">
                {/* Banner Image */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Stage Badge */}
                  <Badge 
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/60 text-white border-none"
                  >
                    {startup.startupDetails.stage}
                  </Badge>

                  {/* Logo */}
                  <div className="absolute -bottom-8 left-4">
                    <div className="h-16 w-16 rounded-xl bg-background shadow-lg p-2 border-2 border-muted">
                      {startup.startupDetails.startupLogo ? (
                        <img 
                          src={startup.startupDetails.startupLogo.secure_url} 
                          alt={startup.startupDetails.startupName}
                          className="h-full w-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="h-full w-full rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-blue-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <CardContent className="pt-10 p-4">
                  {/* Startup Name and Website */}
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-lg group-hover:text-blue-500 transition-colors">
                      {startup.startupDetails.startupName}
                    </h3>
                    {startup.additionalInfo?.website && (
                      <a 
                        href={startup.additionalInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-blue-500 transition-colors inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-3.5 w-3.5" />
                        {startup.additionalInfo.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {startup.businessActivities.missionAndVision}
                  </p>

                  {/* Industries */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {startup.startupDetails.industries.map((industry, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        {industry}
                      </Badge>
                    ))}
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Floating Action Button */}
      <motion.div 
        className="fixed bottom-24 right-6 md:hidden z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          duration: 0.6 
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => router.push('/startup/projects/create')}
            size="lg"
            className="h-16 w-16 rounded-full shadow-2xl bg-black hover:bg-black/90 dark:bg-zinc-900 dark:hover:bg-zinc-800 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
              <Plus className="h-7 w-7" />
            </div>
            <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl scale-150 opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}