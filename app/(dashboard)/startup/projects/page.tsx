"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Startup {
  _id: string;
  startupDetails: {
    startupName: string;
    industry: string;
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

  if (startups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold">No Startups Found</h2>
        <p className="text-muted-foreground">
          You haven't registered any startups yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Startups</h1>
        <Button 
          onClick={() => router.push('/startup/projects/createnewproject')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Startup
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <Card 
            key={startup._id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/startup/projects/${startup._id}`)}
          >
            <CardHeader>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground block">Startup Name</span>
                <CardTitle>{startup.startupDetails.startupName}</CardTitle>
              </div>
              <div className="mt-2">
                <span className="text-xs text-muted-foreground block mb-1">Industry & Stage</span>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{startup.startupDetails.industry}</Badge>
                  <Badge variant="outline">{startup.startupDetails.stage}</Badge>
                  <Badge>{startup.startupDetails.businessModel}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Mission & Vision</span>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {startup.businessActivities.missionAndVision}
                  </p>
                </div>
                
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Founding Team</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>
                      {startup.startupDetails.founders.length} Founder(s)
                    </span>
                  </div>
                </div>

                {startup.additionalInfo.website && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Website</span>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={startup.additionalInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Registration Date</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(startup.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

