"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileText, Building2, User, Lock, Unlock, ArrowUpRight, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

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
  } | null;
}

interface ResearchPaperCardProps {
  paper: ResearchPaper;
  index: number;
}

const STAGE_COLORS = {
  "Completed": "bg-emerald-500/10 text-emerald-700",
  "Identifying a Research Problem or Question": "bg-blue-500/10 text-blue-700",
  "Conducting a Literature Review": "bg-violet-500/10 text-violet-700",
  "Data Collection": "bg-amber-500/10 text-amber-700",
  "Data Analysis": "bg-cyan-500/10 text-cyan-700",
  "Reporting and Presenting Findings": "bg-rose-500/10 text-rose-700",
  "default": "bg-slate-500/10 text-slate-700"
};

const BANNER_GRADIENTS = [
  "from-purple-600/90 to-blue-600/90",
  "from-emerald-600/90 to-cyan-600/90",
  "from-orange-600/90 to-red-600/90",
];

export function ResearchPaperCard({ paper, index }: ResearchPaperCardProps) {
  const router = useRouter();
console.log(paper)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => router.push(`/explore/research-papers/${paper._id}`)}
      className="cursor-pointer"
    >
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative">
          {/* Banner Section */}
          <div className="h-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-[url('/research-banner.jpg')]" />
            <div className={`absolute inset-0 bg-gradient-to-r ${BANNER_GRADIENTS[index % BANNER_GRADIENTS.length]} mix-blend-multiply`} />
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Title and Access Badge */}
            <div className="relative p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg line-clamp-2 text-white group-hover:text-white/90 transition-colors">
                  {paper.title}
                </h3>
                {paper.isPublished && (
                  paper.isFree ? (
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                      <Unlock className="h-3 w-3 mr-1" />
                      Free Access
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                      <Lock className="h-3 w-3 mr-1" />
                      ${paper.price}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-4">
            {/* Researcher Info */}
            {paper.researcher && (
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{paper.researcher.personalInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{paper.researcher.academicInfo.institution}</span>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3">
              {paper.description}
            </p>

            {/* Stage and DOI */}
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`${STAGE_COLORS[paper.stage as keyof typeof STAGE_COLORS] || STAGE_COLORS.default} border-none flex items-center gap-1`}
              >
                <BookOpen className="h-3 w-3" />
                {paper.stage}
              </Badge>
              {paper.doi && (
                <Badge 
                  variant="outline" 
                  className="text-xs flex items-center gap-1 group-hover:bg-primary/5 transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  DOI: {paper.doi}
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(paper.publicationDate), { addSuffix: true })}
                </span>
              </div>
              <Badge 
                variant="secondary" 
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                View Details
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 