"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Users,
  Target,
  Building2,
  Plus,
  ChevronRight,
  Globe,
} from "lucide-react";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";

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
    businessModel: string;
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
}

const trendingStartups: TrendingStartup[] = [
  { name: "AI Solutions", category: "Technology", growth: "+45%" },
  { name: "GreenTech", category: "CleanTech", growth: "+38%" },
  { name: "HealthPlus", category: "Healthcare", growth: "+52%" },
  { name: "FinEdge", category: "Fintech", growth: "+41%" },
  { name: "EduTech", category: "Education", growth: "+35%" },
  { name: "RoboTech", category: "Robotics", growth: "+48%" },
  { name: "CloudServe", category: "Cloud", growth: "+43%" },
  { name: "DataAI", category: "Big Data", growth: "+50%" },
];

export default function StartupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchStartups();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingStartups.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
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

  return (
    <div className="container py-4 px-4 md:px-6 space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {session?.user?.name}! ✨
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Manage your startup ventures and track your progress.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Rocket className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{startups.length}</p>
          <p className="text-sm text-blue-600/70">Active Startups</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Users className="h-6 w-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-emerald-600/70">Team Members</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Target className="h-6 w-6 text-violet-500 mb-2" />
          <p className="text-2xl font-bold">89%</p>
          <p className="text-sm text-violet-600/70">Goals Met</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Building2 className="h-6 w-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-amber-600/70">Projects</p>
        </div>
      </div>

      {/* Trending Startups - Mobile Only */}
      <div className="md:hidden space-y-4 overflow-hidden">
        <h2 className="text-xl font-semibold">Trending Startups</h2>
        <div className="relative w-full">
          <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x">
            <AnimatePresence initial={false}>
              <motion.div 
                className="flex gap-4 px-4"
                animate={{ x: `-${currentIndex * 288}px` }} // 280px card width + 8px gap
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {trendingStartups.map((trending, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-[280px] bg-gradient-to-r from-background to-background/80 
                      border rounded-xl p-4 snap-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Rocket className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">{trending.name}</p>
                          <p className="text-sm text-muted-foreground">{trending.category}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-emerald-500/10 text-emerald-600"
                      >
                        {trending.growth}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-1 mt-4">
            {trendingStartups.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index 
                    ? 'bg-blue-500' 
                    : 'bg-blue-200 hover:bg-blue-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Startups Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Startups</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {startups.map((startup, index) => (
            <div 
              key={startup._id}
              onClick={() => router.push(`/startup/projects/${startup._id}`)}
              className="group cursor-pointer"
            >
              <div className="bg-background rounded-xl border transition-colors duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/10">
                {/* Banner */}
                <div className="h-24 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent rounded-t-xl" />

                {/* Content */}
                <div className="p-6 -mt-12">
                  <div className="flex items-center gap-4 mb-4">
                    {startup.startupDetails.startupLogo ? (
                      <img 
                        src={startup.startupDetails.startupLogo.secure_url}
                        alt={startup.startupDetails.startupName}
                        className="h-16 w-16 object-contain rounded-xl bg-background p-2 border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-background p-2 border flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-blue-500/70" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{startup.startupDetails.startupName}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {startup.startupDetails.stage}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {startup.businessActivities.missionAndVision}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {startup.startupDetails.industries.map((industry, i) => (
                      <Badge 
                        key={i} 
                        variant="outline"
                        className="bg-transparent"
                      >
                        {industry}
                      </Badge>
                    ))}
                  </div>

                  {startup.additionalInfo?.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                      <Globe className="h-4 w-4" />
                      <span>{startup.additionalInfo.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Mobile FAB */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          onClick={() => router.push('/startup/projects/create')}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 
            flex items-center justify-center transition-all duration-200
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)]"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}