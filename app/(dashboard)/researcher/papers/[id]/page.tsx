"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  CheckCircle2,
  Link2,
  File,
  ArrowUpRight,
  IndianRupee,
  ArrowLeft,
  Download
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

const STAGE_COLORS = {
  "Completed": "bg-emerald-500/10 text-emerald-700",
  "Identifying a Research Problem or Question": "bg-blue-500/10 text-blue-700",
  "Conducting a Literature Review": "bg-violet-500/10 text-violet-700",
  "Data Collection": "bg-amber-500/10 text-amber-700",
  "Data Analysis": "bg-cyan-500/10 text-cyan-700",
  "Reporting and Presenting Findings": "bg-rose-500/10 text-rose-700",
  "default": "bg-slate-500/10 text-slate-700"
};

export default function ResearchDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearchPaper();
  }, [params.id]);

  const fetchResearchPaper = async () => {
    try {
      const response = await fetch(`/api/researcher/papers/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch research paper");
      const data = await response.json();
      setPaper(data.paper);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch research paper details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ResearchDetailsSkeleton />;
  }

  if (!paper) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Research Paper Not Found</h2>
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

  const stageColor = STAGE_COLORS[paper.stage as keyof typeof STAGE_COLORS] || STAGE_COLORS.default;

  return (
    <div className="container py-8 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-black/5" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="bg-white/50 hover:bg-white/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">{paper.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge 
              variant="secondary" 
              className={`${stageColor} px-3 py-1`}
            >
              {paper.stage === "Completed" ? (
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              ) : (
                <Clock className="w-3.5 h-3.5 mr-1.5" />
              )}
              {paper.stage}
            </Badge>
            {paper.isFree ? (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 px-3 py-1">
                Free Access
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 flex items-center gap-1.5 px-3 py-1">
                <IndianRupee className="w-3.5 h-3.5" />
                {paper.price?.toLocaleString('en-IN')}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{new Date(paper.publicationDate).toLocaleDateString('en-IN')}</span>
            </div>
            {paper.doi && (
              <a 
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Link2 className="h-4 w-4" />
                DOI: {paper.doi}
              </a>
            )}
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Abstract</h2>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {paper.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Documents */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>
          <div className="space-y-3">
            {paper.images.map((doc) => (
              <a 
                key={doc.public_id}
                href={doc.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white transition-colors border border-slate-200/60"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-500/10 text-blue-700">
                    <File className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Document</span>
                </div>
                <Download className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchDetailsSkeleton() {
  return (
    <div className="container py-8 space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    </div>
  );
} 