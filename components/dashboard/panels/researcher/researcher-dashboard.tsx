"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResearcherCard } from "@/components/researcher/researcher-card";
import { ResearchPaperCard } from "@/components/researcher/research-paper-card";
import {
  Beaker,
  BookOpen,
  Trophy,
  Users,
  ChevronRight,
  ScrollText,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  images: Array<{ public_id: string; secure_url: string }>;
  publicationDate: string;
  doi: string;
  stage: string;
  isFree: boolean;
  __v: number;
}

interface ResearcherProfile {
  _id: string;
  userId: string;
  personalInfo: {
    name: string;
    email: {
      address: string;
      verified: boolean;
    };
    phone: {
      number: string;
      verified: boolean;
    };
    uniqueId: {
      type: string;
      number: string;
    };
    fieldOfResearch: string[];
  };
  academicInfo: {
    institution: string;
    position: string;
    department: string;
    highestQualification: string;
    yearsOfExperience: number;
  };
  researchPapers: ResearchPaper[];
  onGoingResearches: ResearchPaper[];
  professionalCredentials: {
    orcid: string;
    googleScholar: string;
    researchGate: string;
  };
  documents: {
    profilePicture?: {
      public_id: string;
      secure_url: string;
    };
    cv?: {
      public_id: string;
      secure_url: string;
    };
  };
}

interface ApiResponse {
  success: boolean;
  myProfile: ResearcherProfile;
  researchers: ResearcherProfile[];
}

export default function ResearcherDashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([]);
  const [myProfile, setMyProfile] = useState<ResearcherProfile | null>(null);
  const [completedPapers, setCompletedPapers] = useState<ResearchPaper[]>([]);
  const [ongoingPapers, setOngoingPapers] = useState<ResearchPaper[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchPapers();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/researcher/all');
      const data = await response.json() as ApiResponse;
      
      if (data.success) {
        console.log("Researcher Data:", data);
        setResearchers(data.other);
        setMyProfile(data.myProfile);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch researcher data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPapers = async () => {
    try {
      const response = await fetch("/api/researcher/papers");
      console.log(response)
      if (!response.ok) throw new Error("Failed to fetch research papers");
      const data = await response.json();

      console.log("Fetched papers:", data);

      setCompletedPapers(
        data.papers.filter(
          (paper: ResearchPaper) => paper.stage === "Completed"
        )
      );
      setOngoingPapers(
        data.papers.filter(
          (paper: ResearchPaper) => paper.stage !== "Completed"
        )
      );
    } catch (error) {
      console.error("Error fetching papers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch research papers",
        variant: "destructive",
      });
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {session?.user?.name}! 🔬
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Track your research progress and connect with fellow researchers.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-xl p-4 md:p-6">
          <BookOpen className="h-6 w-6 text-purple-500 mb-2" />
          <p className="text-2xl font-bold">
            {myProfile?.researchPapers?.length || 0}
          </p>
          <p className="text-sm text-purple-600/70">Publications</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent rounded-xl p-4 md:p-6">
          <ScrollText className="h-6 w-6 text-cyan-500 mb-2" />
          <p className="text-2xl font-bold">
            {myProfile?.onGoingResearches?.length || 0}
          </p>
          <p className="text-sm text-cyan-600/70">Active Projects</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Trophy className="h-6 w-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold">
            {myProfile?.academicInfo?.yearsOfExperience || 0}
          </p>
          <p className="text-sm text-emerald-600/70">Years Experience</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Users className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{researchers?.length}</p>
          <p className="text-sm text-blue-600/70">Fellow Researchers</p>
        </div>
      </div>

      {/* Research Papers Section */}
      <div className="space-y-6">
        {/* Completed Research Papers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Completed Research Papers</h2>
            <Button
              variant="ghost"
              className="text-purple-500 hover:text-purple-600"
              onClick={() => router.push("/researcher/papers")}
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <ScrollArea className="w-full">
            <div className="flex space-x-6 pb-4">
              {completedPapers.length > 0 ? (
                completedPapers.map((paper, index) => (
                  <div key={paper._id} className="w-[400px] flex-none">
                    <ResearchPaperCard paper={paper} index={index} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-muted-foreground py-8">
                  No completed research papers yet
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Ongoing Research Papers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ongoing Research</h2>
            <Button
              variant="ghost"
              className="text-purple-500 hover:text-purple-600"
              onClick={() => router.push("/researcher/papers")}
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <ScrollArea className="w-full">
            <div className="flex space-x-6 pb-4">
              {ongoingPapers.length > 0 ? (
                ongoingPapers.map((paper, index) => (
                  <div key={paper._id} className="w-[400px] flex-none">
                    <ResearchPaperCard paper={paper} index={index} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-muted-foreground py-8">
                  No ongoing research papers
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      {/* Researchers Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Fellow Researchers</h2>
          <Button
            variant="ghost"
            className="text-purple-500 hover:text-purple-600"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-6 pb-4">
            {researchers.map((researcher, index) => (
              <div key={researcher._id} className="w-[400px] flex-none">
                <ResearcherCard
                  researcher={{
                    _id: researcher._id,
                    userId: researcher.userId,
                    personalInfo: {
                      name: researcher.personalInfo.name,
                      email: {
                        address: researcher.personalInfo.email.address,
                      },
                      fieldOfResearch: researcher.personalInfo.fieldOfResearch,
                    },
                    academicInfo: researcher.academicInfo,
                    professionalCredentials: researcher.professionalCredentials,
                    documents: researcher.documents,
                  }}
                  index={index}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
