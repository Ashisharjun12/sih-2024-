"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User2, Globe, BookOpen, Trophy, GraduationCap, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ResearcherCardProps {
  researcher: {
    _id: string;
    personalInfo: {
      fullName: string;
      profilePicture?: {
        secure_url: string;
      };
      designation: string;
      department: string;
      institution: string;
      expertise: string[];
      researchInterests: string[];
      about: string;
    };
    academicInfo: {
      publications: number;
      citations: number;
      hIndex: number;
    };
    additionalInfo?: {
      website?: string;
      socialMedia?: {
        linkedIn?: string;
      };
    };
    isOpenToCollaboration?: boolean;
  };
  index: number;
}

const BANNER_GRADIENTS = [
  "from-purple-600/90 to-blue-600/90",
  "from-blue-600/90 to-cyan-600/90",
  "from-indigo-600/90 to-purple-600/90",
];

export function ResearcherCard({ researcher, index }: ResearcherCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-[90%]"
    >
      <Card className="cursor-pointer group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Banner Image with Gradient Overlay */}
            <div className="h-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/researcher-banner.jpg')] bg-cover bg-center" />
              <div className={`absolute inset-0 bg-gradient-to-r ${BANNER_GRADIENTS[index % BANNER_GRADIENTS.length]} mix-blend-multiply`} />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile Picture and Title Section */}
            <div className="relative px-4 -mt-8">
              <div className="flex items-center gap-3">
                {researcher.personalInfo.profilePicture ? (
                  <img
                    src={researcher.personalInfo.profilePicture.secure_url}
                    alt={researcher.personalInfo.fullName}
                    className="h-14 w-14 rounded-full object-cover bg-white p-1 ring-2 ring-white shadow-lg"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center ring-2 ring-white shadow-lg">
                    <User2 className="h-7 w-7 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {researcher.personalInfo.fullName}
                  </h3>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {researcher.isOpenToCollaboration && (
                      <Badge variant="secondary" className="bg-green-500 mt-1.5 text-white border-none text-xs">
                        Open to Collaborate
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-white/20 text-white border-none text-xs">
                      {researcher.personalInfo.designation}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-2.5 bg-gradient-to-b from-transparent to-blue-50/50">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-1.5">
                <div className="flex items-center gap-1.5 text-xs">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{researcher.academicInfo.publications} Publications</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>h-index: {researcher.academicInfo.hIndex}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{researcher.personalInfo.department}</span>
                </div>
              </div>

              {/* Expertise & Research Interests */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-1.5">
                  {researcher.personalInfo.expertise.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="outline"
                      className="bg-transparent text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {researcher.personalInfo.researchInterests.map((interest, i) => (
                    <Badge 
                      key={i} 
                      variant="outline"
                      className="bg-blue-500/10 text-blue-600 text-xs border-none"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* About */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {researcher.personalInfo.about}
              </p>

              {/* Social Links */}
              {researcher.additionalInfo && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  {researcher.additionalInfo.website && (
                    <Link 
                      href={researcher.additionalInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5 text-blue-600" />
                    </Link>
                  )}
                  {researcher.additionalInfo.socialMedia?.linkedIn && (
                    <Link 
                      href={researcher.additionalInfo.socialMedia.linkedIn} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
