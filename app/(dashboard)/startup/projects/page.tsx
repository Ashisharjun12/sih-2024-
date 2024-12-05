"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2, Globe, ChevronRight, Plus, Rocket,
  Users, Target, Calendar
} from "lucide-react";

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

const BANNER_GRADIENTS = [
  "from-blue-600/90 to-cyan-600/90",
  "from-purple-600/90 to-blue-600/90",
  "from-emerald-600/90 to-cyan-600/90",
];

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

      {/* Startups Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startups.map((startup, index) => (
          <motion.div
            key={startup._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(`/startup/projects/${startup._id}`)}
          >
            <Card className="cursor-pointer group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Banner Image with Gradient Overlay */}
                  <div className="h-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/startup-banner.jpg')] bg-cover bg-center" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${BANNER_GRADIENTS[index % BANNER_GRADIENTS.length]} mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Logo and Title */}
                    <div className="relative p-6 flex items-start gap-4">
                      {startup.startupDetails.startupLogo ? (
                        <img
                          src={startup.startupDetails.startupLogo.secure_url}
                          alt={startup.startupDetails.startupName}
                          className="h-16 w-16 rounded-lg object-cover bg-white p-1"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-white/90 flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-white">{startup.startupDetails.startupName}</h3>
                        <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                          {startup.startupDetails.stage}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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

