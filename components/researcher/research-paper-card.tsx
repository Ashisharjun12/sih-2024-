"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  CheckCircle2,
  Link2,
  File,
  ArrowUpRight,
  IndianRupee
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  publicationDate: string;
  stage: string;
  doi?: string;
  images: Array<{ public_id: string; secure_url: string }>;
  isFree: boolean;
  price?: number;
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

export function ResearchPaperCard({ paper, index }: ResearchPaperCardProps) {
  const router = useRouter();
  const stageColor = STAGE_COLORS[paper.stage as keyof typeof STAGE_COLORS] || STAGE_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => router.push(`/researcher/papers/${paper._id}`)}
      className="cursor-pointer"
    >
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader className="pb-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <CardTitle className="line-clamp-1 text-lg font-medium">
                {paper.title}
              </CardTitle>
              {paper.isFree ? (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 font-medium">
                  Free Access
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 flex items-center gap-1.5 font-medium">
                  <IndianRupee className="w-3 h-3" />
                  {paper.price?.toLocaleString('en-IN')}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className={`${stageColor}`}
              >
                {paper.stage === "Completed" ? (
                  <CheckCircle2 className="w-3 h-3 mr-1.5" />
                ) : (
                  <Clock className="w-3 h-3 mr-1.5" />
                )}
                {paper.stage}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {paper.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(paper.publicationDate).toLocaleDateString('en-IN')}</span>
            </div>

            <div className="flex items-center gap-3">
              {paper.doi && (
                <a 
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors group/link"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>DOI</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              )}

              {paper.images.map((image) => (
                <a 
                  key={image.public_id}
                  href={image.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <File className="h-3.5 w-3.5" />
                  <span>Document</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 