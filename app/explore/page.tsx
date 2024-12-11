"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StartupCard } from "@/components/startup/startup-card";
import { ResearcherCard } from "@/components/researcher/researcher-card";
import { ResearchPaperCard } from "@/components/researcher/research-paper-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

interface Startup {
  _id: string;
  startupDetails: {
    startupName: string;
    startupLogo?: {
      secure_url: string;
    };
    industries: string[];
    sectors: string[];
    stage: string;
    businessModel: string;
    revenueModel: string;
    founders: Array<{
      name: string;
      role: string;
      contactDetails: string;
    }>;
    equitySplits: Array<{
      ownerName: string;
      equityPercentage: number;
    }>;
    about: string;
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
  isActivelyFundraising: boolean;
}

interface Researcher {
  _id: string;
  userId: string;
  personalInfo: {
    name: string;
    email: { address: string };
    fieldOfResearch: string[];
  };
  academicInfo: {
    institution: string;
    position: string;
    department: string;
    highestQualification: string;
    yearsOfExperience: number;
  };
  professionalCredentials: {
    orcid: string;
    googleScholar: string;
    researchGate: string;
  };
  documents: {
    profilePicture?: {
      secure_url: string;
    };
  };
  researchPapers: string[];
}

interface Mentor {
  _id: string;
  // Add mentor interface properties
}

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  publicationDate: string;
  doi?: string;
  stage: string;
  isPublished: boolean;
  isFree?: boolean;
  price?: number;
  images: Array<{
    public_id: string;
    secure_url: string;
  }>;
  researcher: {
    personalInfo: {
      name: string;
    };
    academicInfo: {
      institution: string;
    };
  };
}

export default function ExplorePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/explore');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('API Response:', data);
        
        setStartups(data.startups);
        setResearchers(data.researchers);
        setResearchPapers(data.researchPapers);
        console.log('Research Papers:', data.researchPapers);
        setMentors(data.mentors);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search startups, papers, researchers, or mentors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="startups" className="space-y-6">
        <TabsList>
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="papers">Research Papers</TabsTrigger>
          <TabsTrigger value="researchers">Researchers</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
        </TabsList>

        <TabsContent value="startups">
          {isLoading ? (
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
                    onClick={() =>
                      router.push(`/explore/startupDetails/${startup._id}`)
                    }
                    className="w-[400px] flex-none"
                  >
                    <StartupCard startup={startup} index={index} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="papers">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-[300px] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {researchPapers
                .filter(paper => {
                  const searchLower = searchTerm.toLowerCase();
                  return (
                      paper.title.toLowerCase().includes(searchLower) ||
                      paper.description.toLowerCase().includes(searchLower) ||
                      paper.stage.toLowerCase().includes(searchLower) ||
                      paper.researcher.personalInfo.name.toLowerCase().includes(searchLower) ||
                      paper.researcher.academicInfo.institution.toLowerCase().includes(searchLower) ||
                      (paper.doi?.toLowerCase().includes(searchLower) || false)
                  );
                })
                .map((paper, index) => (
                  <motion.div
                    key={paper._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ResearchPaperCard paper={paper} index={index} />
                  </motion.div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="researchers">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-[300px] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {researchers
                .filter(researcher => {
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    researcher.personalInfo.name.toLowerCase().includes(searchLower) ||
                    researcher.academicInfo.institution.toLowerCase().includes(searchLower) ||
                    researcher.academicInfo.department.toLowerCase().includes(searchLower) ||
                    researcher.personalInfo.fieldOfResearch.some(field => 
                      field.toLowerCase().includes(searchLower)
                    )
                  );
                })
                .map((researcher, index) => (
                  <motion.div
                    key={researcher._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ResearcherCard researcher={researcher} index={index} />
                  </motion.div>
                ))}
            </div>
          )}
        </TabsContent>

        {/* <TabsContent value="fundingAgency">FundingAgency</TabsContent> */}
      </Tabs>
    </div>
  );
}
