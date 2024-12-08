"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StartupCard } from "@/components/startup/startup-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Startup {
  _id: string;
  startupDetails: {
    startupName: string;
    startupLogo?: {
      secure_url: string;
    };
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

export default function StartupProjects() {
  const router = useRouter();
  const { data: session } = useSession();
  const [startups, setStartups] = useState<Startup[]>([]);
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
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Startups</h1>
            <p className="text-muted-foreground max-w-lg">
              Manage and track all your startup ventures in one place.
            </p>
          </div>
          <Button
            onClick={() => router.push('/startup/projects/create')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hidden md:flex"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Startups ScrollArea */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse" />
          ))}
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="flex space-x-6 pb-4">
            {startups.map((startup, index) => (
              <div
                key={startup._id}
            
                className="w-[400px] flex-none"
              >
                <StartupCard startup={startup} index={index} /> 
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {/* Mobile FAB */}
      <motion.div 
        className="fixed bottom-24 right-6 z-50 md:hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => router.push('/startup/projects/create')}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 
            hover:from-blue-700 hover:to-cyan-600 p-0"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    </div>
  );
}

