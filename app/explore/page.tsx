"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StartupCard } from "@/components/startup/startup-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface Startup {
  _id: string;
  startupDetails: {
    startupName: string;
    startupLogo?: {
      secure_url: string;
    };
    industries: string[];
    stage: string;
  };
  businessActivities: {
    missionAndVision: string;
  };
}

export default function ExplorePage() {
  const { toast } = useToast();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await fetch('/api/explore');
      if (!response.ok) throw new Error('Failed to fetch startups');
      
      const data = await response.json();
      console.log('Fetched startups data:', {
        totalStartups: data.startups.length,
        startups: data.startups
      });
      setStartups(data.startups);
    } catch (error) {
      console.error('Error fetching startups:', error);
      toast({
        title: "Error",
        description: "Failed to fetch startups",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStartups = startups.filter(startup => 
    startup.startupDetails.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    startup.startupDetails.industries.some(industry => 
      industry.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container py-6 space-y-8">
      {/* Title Section */}
      <div className="space-y-4">
        <motion.h1 
          className="text-4xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Explore Innovation Hub
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Discover innovative startups, groundbreaking research projects, and connect with experienced mentors all in one place.
        </motion.p>
      </div>

      {/* Search Section */}
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, industry, or technology..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Startups Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse" />
          ))}
        </div>
      ) : filteredStartups.length > 0 ? (
        <ScrollArea className="w-full">
          <div className="flex space-x-6 pb-4">
            {filteredStartups.map((startup, index) => (
              <div
                key={startup._id}
                onClick={() => router.push(`/explore/${startup._id}`)}
                className="w-[400px] flex-none"
              >
                <StartupCard startup={startup} index={index} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No startups found</p>
        </div>
      )}
    </div>
  );
}
