"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResearchPaperCard } from "@/components/researcher/research-paper-card";
import { 
  ArrowLeft, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Link2, 
  Mail,
  Phone,
  Fingerprint,
  Beaker,
  ScrollText
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  researchPapers: Array<any>;
  onGoingResearches: Array<any>;
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

export default function ResearcherProfile({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [researcher, setResearcher] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearcher();
  }, [params.id]);

  const fetchResearcher = async () => {
    try {
      const response = await fetch(`/api/researcher/profile/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch researcher");
      const data = await response.json();
      setResearcher(data.researcher);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch researcher details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ResearcherProfileSkeleton />;
  }

  if (!researcher) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Researcher Not Found</h2>
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-black/5" />
        <div className="relative">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="relative h-32 w-32 rounded-xl overflow-hidden bg-white shadow-lg">
              {researcher.documents.profilePicture ? (
                <Image
                  src={researcher.documents.profilePicture.secure_url}
                  alt={researcher.personalInfo.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <GraduationCap className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {researcher.personalInfo.name}
                </h1>
                <p className="text-muted-foreground">
                  {researcher.academicInfo.position} at {researcher.academicInfo.institution}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {researcher.personalInfo.fieldOfResearch.map((field, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-500/10 text-blue-700">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Contact & Credentials */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{researcher.personalInfo.email.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{researcher.personalInfo.phone.number}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
                <span>{researcher.personalInfo.uniqueId.type}: {researcher.personalInfo.uniqueId.number}</span>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Academic Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{researcher.academicInfo.institution}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{researcher.academicInfo.highestQualification}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Beaker className="h-4 w-4 text-muted-foreground" />
                <span>{researcher.academicInfo.department}</span>
              </div>
            </div>
          </div>

          {/* Professional Links */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Professional Links</h2>
            <div className="space-y-3">
              {researcher.professionalCredentials.orcid && (
                <a 
                  href={researcher.professionalCredentials.orcid}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Link2 className="h-4 w-4" />
                  ORCID
                </a>
              )}
              {researcher.professionalCredentials.googleScholar && (
                <a 
                  href={researcher.professionalCredentials.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Link2 className="h-4 w-4" />
                  Google Scholar
                </a>
              )}
              {researcher.professionalCredentials.researchGate && (
                <a 
                  href={researcher.professionalCredentials.researchGate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Link2 className="h-4 w-4" />
                  ResearchGate
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Research Papers */}
        <div className="md:col-span-2">
          <Tabs defaultValue="ongoing" className="space-y-6">
            <TabsList>
              <TabsTrigger value="ongoing" className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" />
                Ongoing Research
                <Badge variant="secondary" className="ml-2">
                  {researcher.onGoingResearches.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Completed Papers
                <Badge variant="secondary" className="ml-2">
                  {researcher.researchPapers.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ongoing" className="space-y-4">
              {researcher.onGoingResearches.length > 0 ? (
                <div className="grid gap-4">
                  {researcher.onGoingResearches.map((paper, index) => (
                    <ResearchPaperCard 
                      key={paper._id}
                      paper={paper}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No ongoing research papers
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {researcher.researchPapers.length > 0 ? (
                <div className="grid gap-4">
                  {researcher.researchPapers.map((paper, index) => (
                    <ResearchPaperCard 
                      key={paper._id}
                      paper={paper}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No completed research papers
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ResearcherProfileSkeleton() {
  return (
    <div className="container py-8 space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <Skeleton className="h-10 w-20 mb-4" />
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-32 w-32 rounded-xl" />
          <div className="space-y-4 flex-1">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
        <div className="md:col-span-2">
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
} 