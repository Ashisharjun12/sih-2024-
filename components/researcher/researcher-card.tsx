"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, Building2, GraduationCap, BookOpen, Link, ScrollText, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  publicationDate: string;
  doi: string;
  stage: string;
}

interface ResearcherCardProps {
  researcher: {
    _id: string;
    userId: string;
    personalInfo: {
      name: string;
      email: {
        address: string;
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
  };
  index: number;
}

interface ResearcherData {
  researchPapers: ResearchPaper[];
  onGoingResearches: ResearchPaper[];
}

const BANNER_GRADIENTS = [
  "from-purple-600/90 to-blue-600/90",
  "from-emerald-600/90 to-cyan-600/90",
  "from-orange-600/90 to-red-600/90",
];

export function ResearcherCard({ researcher, index }: ResearcherCardProps) {
  const { toast } = useToast();
  const [researcherData, setResearcherData] = useState<ResearcherData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchResearcherData();
  }, [researcher._id]);

  const fetchResearcherData = async () => {
    try {
      const response = await fetch(`/api/researcher/profile/${researcher._id}`);
      const data = await response.json();
      
      if (data.success) {
        setResearcherData({
          researchPapers: data.researcher.researchPapers,
          onGoingResearches: data.researcher.onGoingResearches
        });
      }
    } catch (error) {
      console.error('Error fetching researcher data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch researcher details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => router.push(`/researcher/${researcher._id}`)}
      className="cursor-pointer"
    >
      <Card className="cursor-pointer group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Banner Section */}
            <div className="h-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center bg-[url('/researcher-banner.jpg')]" />
              <div className={`absolute inset-0 bg-gradient-to-r ${BANNER_GRADIENTS[index % BANNER_GRADIENTS?.length]} mix-blend-multiply`} />
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Profile and Title */}
              <div className="relative p-6 flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-white relative">
                  {researcher.documents.profilePicture ? (
                    <Image
                      src={researcher.documents.profilePicture.secure_url}
                      alt={researcher.personalInfo.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 64px) 100vw, 64px"
                    />
                  ) : (
                    <div className="h-full w-full bg-white/90 flex items-center justify-center">
                      <Beaker className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    {researcher.personalInfo.name}
                  </h3>
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                    {researcher.academicInfo.position}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Institution Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Building2 className="h-4 w-4" />
                <span>{researcher.academicInfo.institution}</span>
              </div>

              {/* Academic Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <GraduationCap className="h-4 w-4" />
                <span>
                  {researcher.academicInfo.department} • {researcher.academicInfo.highestQualification}
                </span>
              </div>

              {/* Research Papers Count */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <FileText className="h-4 w-4" />
                <span>
                  {researcher.researchPapers.length > 0 
                    ? `${researcher.researchPapers.length} Research Papers`
                    : "No Research Papers yet"}
                </span>
              </div>

              {/* Research Fields */}
              <div className="flex flex-wrap gap-2 mb-4">
                {researcher.personalInfo.fieldOfResearch.map((field, i) => (
                  <Badge 
                    key={i} 
                    variant="outline"
                    className="bg-transparent"
                  >
                    {field}
                  </Badge>
                ))}
              </div>

              {/* Research Stats */}
              {!loading && researcherData && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{researcherData?.researchPapers?.length}</p>
                      <p className="text-xs text-muted-foreground">Publications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScrollText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{researcherData?.onGoingResearches?.length}</p>
                      <p className="text-xs text-muted-foreground">Active Projects</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Links */}
              <div className="pt-4 border-t mt-4">
                <div className="flex flex-wrap gap-3">
                  {researcher.professionalCredentials.googleScholar && (
                    <a
                      href={researcher.professionalCredentials.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <BookOpen className="h-3 w-3" />
                      Google Scholar
                    </a>
                  )}
                  {researcher.professionalCredentials.researchGate && (
                    <a
                      href={researcher.professionalCredentials.researchGate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <Link className="h-3 w-3" />
                      ResearchGate
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 