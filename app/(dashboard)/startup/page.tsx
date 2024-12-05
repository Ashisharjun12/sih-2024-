"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { StartupCard } from "@/components/startup/startup-card";
import {
  Rocket,
  Users,
  Target,
  Building2,
  Plus,
  ChevronRight,
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
      const res = await fetch('/api/startup/projects');
      const data = await res.json();
      if (data.startups) {
        setStartups(data.startups);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
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

      {/* Recent Startups Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Startups</h2>
          <Button
            variant="ghost"
            onClick={() => router.push('/startup/projects')}
            className="text-blue-500 hover:text-blue-600"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-6 pb-4">
            {startups.slice(0, 3).map((startup, index) => (
              <div key={startup._id} className="w-[400px] flex-none">
                <StartupCard startup={startup} index={index} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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