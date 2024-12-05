"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, ChevronRight, Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    founders: Array<{
      name: string;
      role: string;
    }>;
  };
  businessActivities: {
    missionAndVision: string;
  };
  additionalInfo: {
    website?: string;
    socialMedia?: {
      linkedIn?: string;
      twitter?: string;
      facebook?: string;
    };
  };
  createdAt: string;
}

const BANNER_PATTERNS = [
  "radial-gradient(circle at 20% -50%, #4f46e5 0%, #3b82f6 25%, #0ea5e9 50%, #06b6d4 75%, #14b8a6 100%)",
  "radial-gradient(circle at 80% -50%, #8b5cf6 0%, #6366f1 25%, #3b82f6 50%, #0ea5e9 75%, #06b6d4 100%)",
  "radial-gradient(circle at 50% -20%, #ec4899 0%, #d946ef 25%, #8b5cf6 50%, #6366f1 75%, #3b82f6 100%)",
];

export default function StartupProjects() {
  const router = useRouter();
  const { data: session } = useSession();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch("/api/startup/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }
        const data = await response.json();
        setStartups(data.startups);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch startups");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStartups();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 md:px-6">
      {/* Enhanced Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">My Startups</h1>
          <p className="text-sm text-muted-foreground">Manage and track all your startup ventures</p>
        </div>
        
        {/* Desktop Create Button */}
        <Button 
          onClick={() => router.push('/startup/projects/createnewproject')}
          className="hidden md:flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" />
          Create New Startup
        </Button>
      </div>

      {/* Grid with responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {startups.map((startup, index) => (
          <motion.div
            key={startup._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => router.push(`/startup/projects/${startup._id}`)}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
              {/* Banner with Pattern */}
              <div 
                className="h-28 relative"
                style={{ 
                  background: BANNER_PATTERNS[index % BANNER_PATTERNS.length],
                }}
              >
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 mix-blend-soft-light opacity-40"
                     style={{
                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                     }}
                />

                {/* Stage Badge */}
                <Badge 
                  className="absolute top-4 right-4 bg-white/90 text-primary shadow-lg"
                  variant="secondary"
                >
                  {startup.startupDetails.stage}
                </Badge>

                {/* Logo Container */}
                <div className="absolute -bottom-6 left-6">
                  <div className="h-16 w-16 rounded-2xl bg-white shadow-lg p-2 border-2 border-white">
                    {startup.startupDetails.startupLogo ? (
                      <img 
                        src={startup.startupDetails.startupLogo.secure_url} 
                        alt={startup.startupDetails.startupName}
                        className="h-full w-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="h-full w-full rounded-xl bg-primary/5 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-primary/70" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="pt-8 pb-6 px-6">
                {/* Title and Model */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground/90">
                      {startup.startupDetails.startupName}
                    </h3>
                    <Badge variant="outline" className="mt-1 bg-primary/5 text-primary/70">
                      {startup.startupDetails.businessModel}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {startup.businessActivities.missionAndVision}
                </p>

                {/* Industries */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {startup.startupDetails.industries.map((industry: string, i: number) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="text-xs bg-secondary/30 hover:bg-secondary/40 transition-colors"
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  {startup.additionalInfo?.website && (
                    <a 
                      href={startup.additionalInfo.website.startsWith('http') 
                        ? startup.additionalInfo.website 
                        : `https://${startup.additionalInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5
                               transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="h-4 w-4" />
                      {startup.additionalInfo.website.replace(/^(https?:\/\/)?(www\.)?/, '')}
                    </a>
                  )}

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary/80 hover:bg-primary/5 -mr-2"
                  >
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mobile Create Button - Fixed at bottom */}
      <motion.div 
        className="fixed bottom-24 right-4 md:hidden z-50"
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
            onClick={() => router.push('/startup/projects/createnewproject')}
            size="lg"
            className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 relative group overflow-hidden"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-foreground/10 via-primary-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative z-10 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
              <Plus className="h-6 w-6" />
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary-foreground/20 blur-xl scale-150 opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          </Button>

          {/* Tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm text-foreground text-xs py-1.5 px-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border">
            Create New Startup
          </div>
        </motion.div>
      </motion.div>

      {/* Empty State */}
      {startups.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">No Startups Found</h2>
          <p className="text-sm text-muted-foreground text-center">
            You haven't registered any startups yet.
            <br />
            Create your first startup to get started!
          </p>
          <Button 
            onClick={() => router.push('/startup/projects/createnewproject')}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Startup
          </Button>
        </div>
      )}
    </div>
  );
}

