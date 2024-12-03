"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe, Users, TrendingUp, Rocket, Search, Filter, ArrowUpRight, X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Add these interfaces at the top of the file
interface Startup {
  _id: string;
  startupDetails: {
    startupName: string;
    industry: string;
    stage: string;
    businessModel: string;
    revenueModel: string;
    founders: Array<{
      name: string;
      role: string;
      contactDetails: string;
    }>;
  };
  additionalInfo: {
    pitchDeck: {
      public_id: string;
      secure_url: string;
    };
    website?: string;
    socialMedia?: {
      linkedIn?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  businessActivities: {
    missionAndVision: string;
  };
}

interface Researcher {
  _id: string;
  name: string;
  image: string;
  institution: string;
  field: string;
  publications: number;
  research: string;
  interests: string[];
}

interface TrendingItem {
  title: string;
  description: string;
  category: string;
}

interface TrendingSection {
  title: string;
  items: TrendingItem[];
}

type ViewType = 'startups' | 'researchers' | 'trending';

export default function ExplorePage() {
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState<ViewType>('startups');
  const [showAllModal, setShowAllModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    startups: Startup[];
    researchers: Researcher[];
  }>({
    startups: [],
    researchers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Page - Fetching data for view:', selectedView);

        const response = await fetch(`/api/explore?type=${selectedView}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        console.log('Page - Received data:', result);
        
        setData(prevData => ({
          ...prevData,
          ...(result.startups && { startups: result.startups }),
          ...(result.researchers && { researchers: result.researchers })
        }));

      } catch (error) {
        console.error('Page - Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedView, toast]);

  // Update the getCurrentData function
  const getCurrentData = () => {
    console.log('Page - Current data state:', data);
    switch(selectedView) {
      case 'startups':
        return data.startups;
      case 'researchers':
        return data.researchers;
      case 'trending':
        return []; // Return empty array since we removed dummy data
      default:
        return [];
    }
  };

  const getViewTitle = () => {
    switch(selectedView) {
      case 'startups': return 'Featured Startups';
      case 'researchers': return 'Leading Researchers';
      case 'trending': return 'Trending Innovation';
    }
  };

  const getViewDescription = () => {
    switch(selectedView) {
      case 'startups': 
        return "Discover innovative startups making waves";
      case 'researchers': 
        return "Connect with top researchers in their fields";
      case 'trending': 
        return "See what is trending in innovation";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Header */}
        <motion.div 
          className="space-y-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">
            Explore Innovation Hub
          </h1>
          
          {/* Search and Filter Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search startups, researchers, or innovations..." 
                className="pl-10 w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedView('startups')}>
                  Startups
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedView('researchers')}>
                  Researchers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedView('trending')}>
                  Trending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">{getViewTitle()}</h2>
                <p className="text-sm text-muted-foreground">{getViewDescription()}</p>
              </div>
              <Button 
                variant="ghost" 
                className="group"
                onClick={() => setShowAllModal(true)}
              >
                View All
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-32 bg-muted" />
                    <CardContent className="relative pt-12">
                      <div className="absolute -top-8 left-4">
                        <div className="h-16 w-16 rounded-full bg-muted" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="flex gap-2">
                          <div className="h-4 bg-muted rounded w-16" />
                          <div className="h-4 bg-muted rounded w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Actual content
                getCurrentData()
                  .slice(0, 6)
                  .map((item: Startup | Researcher, index: number) => (
                  <StartupCard 
                    key={item._id} 
                    startup={item as Startup} 
                    index={index}
                    label={selectedView === 'trending' ? 'Trending' : undefined}
                  />
                  ))
              )}
            </div>
          </section>

          {/* Recommendations Section */}
          {selectedView === 'startups' && data.startups.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">Recommended For You</h2>
                  <p className="text-sm text-muted-foreground">Based on your interests</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.startups.slice(0, 3).map((startup, index) => (
                  <StartupCard 
                    key={startup._id} 
                    startup={startup} 
                    index={index}
                    label="Recommended"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* View All Modal */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getViewTitle()}</DialogTitle>
            <DialogDescription>{getViewDescription()}</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {getCurrentData()
              .map((item: Startup | Researcher, index: number) => (
                <StartupCard 
                  key={item._id} 
                  startup={item as Startup} 
                  index={Math.min(index, 5)}
                  label={selectedView === 'trending' ? 'Trending' : undefined}
                />
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Startup Card Component
function StartupCard({ 
  startup, 
  index, 
  label 
}: { 
  startup: Startup; 
  index: number; 
  label?: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        {/* Cover Image (Pitch Deck) */}
        <div className="h-32 bg-cover bg-center relative">
          <img 
            src={startup.additionalInfo?.pitchDeck?.secure_url || 
              "https://images.unsplash.com/photo-1451187580459-43490279c0fa"}
            alt={startup.startupDetails.startupName}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          
          {/* Stage Badge */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <Badge className="bg-primary/60 hover:bg-primary/70 backdrop-blur-sm">
              {startup.startupDetails.stage}
            </Badge>
          </div>
        </div>

        <CardContent className="relative pt-12">
          {/* Profile Image */}
          <div className="absolute -top-8 left-4">
            <div className="h-16 w-16 rounded-full border-4 border-background overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt={`${startup.startupDetails.startupName} founder`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="space-y-3">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {startup.startupDetails.startupName}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {startup.businessActivities.missionAndVision}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{startup.startupDetails.founders.length} Founder(s)</span>
              </div>
              <Badge variant="outline">
                {startup.startupDetails.businessModel}
              </Badge>
              <Badge variant="outline">
                {startup.startupDetails.revenueModel}
              </Badge>
            </div>

            {/* Industry and Links */}
            <div className="flex items-center justify-between pt-3 border-t">
              <Badge variant="secondary">
                {startup.startupDetails.industry}
              </Badge>
              
              <div className="flex gap-2">
                {startup.additionalInfo?.website && (
                  <a
                    href={startup.additionalInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {startup.additionalInfo?.socialMedia?.linkedIn && (
                  <a
                    href={startup.additionalInfo.socialMedia.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <i className="fab fa-linkedin h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Add more sample data
const trendingStartups: Startup[] = [
  {
    _id: "3",
    startupDetails: {
      startupName: "QuantumTech",
      industry: "Technology",
      stage: "Series B",
      businessModel: "B2B",
      revenueModel: "SaaS",
      founders: [{
        name: "John Doe",
        role: "CEO",
        contactDetails: "john@example.com"
      }]
    },
    additionalInfo: {
      pitchDeck: {
        public_id: "sample",
        secure_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
      },
      website: "https://quantumtech.example.com",
      socialMedia: {
        linkedIn: "https://linkedin.com/quantumtech"
      }
    },
    businessActivities: {
      missionAndVision: "Quantum computing solutions for enterprise"
    }
  },
  {
    _id: "11",
    startupDetails: {
      startupName: "MetaVerse Labs",
      industry: "Technology",
      stage: "Series A",
      businessModel: "B2B",
      revenueModel: "Subscription",
      founders: [{
        name: "Jane Smith",
        role: "CEO",
        contactDetails: "jane@example.com"
      }]
    },
    additionalInfo: {
      pitchDeck: {
        public_id: "sample",
        secure_url: "https://images.unsplash.com/photo-1614729939124-123d0b70f5a9"
      },
      website: "https://metaverse.example.com",
      socialMedia: {
        linkedIn: "https://linkedin.com/metaverse-labs"
      }
    },
    businessActivities: {
      missionAndVision: "Building the future of social interaction in virtual worlds"
    }
  },
  {
    _id: "12",
    startupDetails: {
      startupName: "DroneLogistics",
      industry: "Logistics",
      stage: "Seed",
      businessModel: "B2B",
      revenueModel: "Subscription",
      founders: [{
        name: "Bob Johnson",
        role: "CEO",
        contactDetails: "bob@example.com"
      }]
    },
    additionalInfo: {
      pitchDeck: {
        public_id: "sample",
        secure_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e"
      },
      website: "https://dronelogistics.example.com",
      socialMedia: {
        linkedIn: "https://linkedin.com/drone-logistics"
      }
    },
    businessActivities: {
      missionAndVision: "Autonomous drone delivery network for urban areas"
    }
  }
];

const recommendedStartups: Startup[] = [
  {
    _id: "4",
    startupDetails: {
      startupName: "GreenEnergy",
      industry: "CleanTech",
      stage: "Growth",
      businessModel: "B2B",
      revenueModel: "Subscription",
      founders: [{
        name: "Alice Brown",
        role: "CEO",
        contactDetails: "alice@example.com"
      }]
    },
    additionalInfo: {
      pitchDeck: {
        public_id: "sample",
        secure_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e"
      },
      website: "https://greenenergy.example.com"
    },
    businessActivities: {
      missionAndVision: "Renewable energy solutions for sustainable future"
    }
  },
  {
    _id: "13",
    startupDetails: {
      startupName: "AIHealth",
      industry: "Healthcare",
      stage: "Series B",
      businessModel: "B2B",
      revenueModel: "Subscription",
      founders: [{
        name: "Charlie Davis",
        role: "CEO",
        contactDetails: "charlie@example.com"
      }]
    },
    additionalInfo: {
      pitchDeck: {
        public_id: "sample",
        secure_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef"
      },
      website: "https://aihealth.example.com",
      socialMedia: {
        linkedIn: "https://linkedin.com/ai-health"
      }
    },
    businessActivities: {
      missionAndVision: "Personalized healthcare recommendations using AI"
    }
  },
  {
    _id: "14",
    startupDetails: {
      startupName: "SmartCity Solutions",
      industry: "Infrastructure",
      stage: "Growth",
      businessModel: "B2B",
      revenueModel: "Subscription",
      founders: [{
        name: "David Wilson",
        role: "CEO",
        contactDetails: "david@example.com"
      }]
    },
    additionalInfo: {
      pitchDeck: {
        public_id: "sample",
        secure_url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b"
      },
      website: "https://smartcity.example.com",
      socialMedia: {
        linkedIn: "https://linkedin.com/smart-city-solutions"
      }
    },
    businessActivities: {
      missionAndVision: "IoT platform for smart city infrastructure management"
    }
  }
];

// Add more sample data to existing arrays... 