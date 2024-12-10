"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  File,
  ArrowLeft,
  Download,
  Building2,
  User,
  Lock,
  Unlock,
  BookOpen,
  GraduationCap,
  FileText,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface ResearchDocument {
  public_id: string;
  secure_url: string;
  file_type: 'pdf' | 'image' | 'doc' | 'other';
  file_name: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
}

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  publicationDate: string;
  stage: string;
  doi?: string;
  images: ResearchDocument[];
  isFree: boolean;
  price?: number;
  isPublished: boolean;
  hasAccess?: boolean;
  researcher?: {
    personalInfo: {
      name: string;
      avatar?: string;
    };
    academicInfo: {
      institution: string;
      department?: string;
      position?: string;
    };
  };
}

const STAGE_COLORS = {
  "Completed": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  "Identifying a Research Problem or Question": "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "Conducting a Literature Review": "bg-violet-500/10 text-violet-700 border-violet-500/20",
  "Data Collection": "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "Data Analysis": "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  "Reporting and Presenting Findings": "bg-rose-500/10 text-rose-700 border-rose-500/20",
  "default": "bg-slate-500/10 text-slate-700 border-slate-500/20"
};

const BANNER_GRADIENTS = [
  "from-purple-600/90 via-blue-600/80 to-cyan-600/90",
  "from-emerald-600/90 via-teal-600/80 to-cyan-600/90",
  "from-orange-600/90 via-red-600/80 to-rose-600/90",
];

export default function ResearchPaperPage({ params }: { params: { id: string } }) {
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaper = async () => {
      try {

        console.log("Fetching paper SKFHSDKFJDSHKJFHDSJKFHJKDSHFJKHDSJKHFKHDSKFJHJDSKHFJKHDSJKFHJKDSHFKHDSJKFHJDSKHFKJDSHKFJ");
        setLoading(true);
        const response = await fetch(`/api/explore/research-papers/${params.id}`);
        
        console.log("response", response);
        if (!response.ok) {
          throw new Error("Failed to fetch paper details");
        }
        
        const data = await response.json();
        console.log("data", data);
        if (data.success) {
          setPaper(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch paper details");
        }
      } catch (error) {
        console.error("Error fetching paper:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch paper details",
          variant: "destructive",
        });
        router.push("/explore"); // Redirect to explore page on error
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [params.id, toast, router]);

  const handleDownload = async () => {
    if (!paper?.isPublished) {
      toast({
        title: "Access Denied",
        description: "This paper is not yet published",
        variant: "destructive",
      });
      return;
    }

    if (!paper.isFree && !paper.price) {
      toast({
        title: "Access Denied",
        description: "This paper is not available for download",
        variant: "destructive",
      });
      return;
    }

    try {
      setDownloadLoading(true);
      const response = await fetch(`/api/explore/research-papers/${params.id}/download`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to download paper");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}_paper.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Paper downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading paper:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download paper",
        variant: "destructive",
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!paper?.isPublished) {
      toast({
        title: "Access Denied",
        description: "This paper is not yet published",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Buying paper");
      setBuyLoading(true);
      const response = await fetch(`/api/explore/research-papers/${params.id}`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to purchase paper");
      }

      // Update local paper state to reflect access
      setPaper(prev => prev ? { ...prev, hasAccess: true } : null);

      toast({
        title: "Success",
        description: data.message || "Paper purchased successfully",
      });
    } catch (error) {
      console.error("Error purchasing paper:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to purchase paper",
        variant: "destructive",
      });
    } finally {
      setBuyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[150px]" />
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Research Paper Not Found</h1>
          <p className="text-muted-foreground">The requested paper could not be found.</p>
          <Button onClick={() => router.push("/explore")}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Banner Section */}
      <div className="h-[300px] relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/research-banner.jpg')] transition-transform duration-700 hover:scale-105" />
        <div className={`absolute inset-0 bg-gradient-to-br ${BANNER_GRADIENTS[0]} mix-blend-multiply`} />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content */}
        <div className="relative container h-full flex flex-col justify-between py-8">
          {/* Back Button */}
          <Button
            variant="outline"
            className="w-fit bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-colors duration-200"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Papers
          </Button>

          {/* Title and Badges */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-white max-w-3xl bg-clip-text">
                {paper.title}
              </h1>
              {paper.isPublished && (
                paper.isFree ? (
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none shadow-sm backdrop-blur-sm transition-colors duration-200">
                    <Unlock className="h-4 w-4 mr-2" />
                    Free Access
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none shadow-sm backdrop-blur-sm transition-colors duration-200">
                    <Lock className="h-4 w-4 mr-2" />
                    ₹{paper.price}
                  </Badge>
                )
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4">
              <Badge 
                variant="outline" 
                className="bg-white/20 hover:bg-white/30 text-white border-none shadow-sm backdrop-blur-sm transition-colors duration-200"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {formatDistanceToNow(new Date(paper.publicationDate), { addSuffix: true })}
              </Badge>
              {paper.doi && (
                <Badge 
                  variant="outline" 
                  className="bg-white/20 hover:bg-white/30 text-white border-none shadow-sm backdrop-blur-sm transition-colors duration-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  DOI: {paper.doi}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="container py-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Abstract
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {paper.description}
              </p>
            </div>

            {/* Documents Section */}
            {paper.images.length > 0 && paper.isPublished && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <File className="h-5 w-5" />
                    Research Documents
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {paper.images.length} {paper.images.length === 1 ? 'document' : 'documents'}
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {paper.images.map((doc: ResearchDocument, index: number) => (
                    <div key={doc.public_id}>
                      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-card/80 transition-all duration-200 group">
                        <div className="p-3 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {doc.file_name || `Document ${index + 1}`}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {doc.file_size && (
                              <div className="flex items-center gap-1.5">
                                <File className="h-3.5 w-3.5" />
                                <span>{(doc.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                              </div>
                            )}
                            {doc.created_at && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {paper.isFree || paper.hasAccess ? (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => window.open(doc.secure_url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDownload()}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Buy to access
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Researcher Info */}
            {paper.researcher && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Researcher Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12">
                      {paper.researcher.personalInfo.avatar ? (
                        <img
                          src={paper.researcher.personalInfo.avatar}
                          alt={paper.researcher.personalInfo.name}
                          className="rounded-full object-cover w-full h-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {paper.researcher.personalInfo.name}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{paper.researcher.academicInfo.institution}</span>
                        </div>
                        {paper.researcher.academicInfo.department && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{paper.researcher.academicInfo.department}</span>
                          </div>
                        )}
                        {paper.researcher.academicInfo.position && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{paper.researcher.academicInfo.position}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold mb-4">Actions</h3>
              {paper.isPublished ? (
                <>
                  {paper.isFree ? (
                    <>
                      <Button 
                        className="w-full" 
                        size="lg" 
                        onClick={handleDownload}
                        disabled={downloadLoading}
                      >
                        {downloadLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Downloading...
                          </div>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download Paper
                          </>
                        )}
                      </Button>
                      {paper.doi && (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          onClick={() => window.open(`https://doi.org/${paper.doi}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on DOI
                        </Button>
                      )}
                    </>
                  ) : paper.hasAccess ? (
                    <div className="text-sm text-muted-foreground text-center bg-muted/50 rounded-lg p-4">
                      <Unlock className="h-4 w-4 mx-auto mb-2" />
                      You have access to this paper
                    </div>
                  ) :  paper.price ? (
                    <>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" 
                        size="lg" 
                        onClick={handleBuy}
                        disabled={buyLoading}
                      >
                        {buyLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Buy Now (₹{paper.price})
                          </>
                        )}
                      </Button>
                      {paper.doi && (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          onClick={() => window.open(`https://doi.org/${paper.doi}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on DOI
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center bg-muted/50 rounded-lg p-4">
                      <Lock className="h-4 w-4 mx-auto mb-2" />
                      This paper is not available for download
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground text-center bg-muted/50 rounded-lg p-4">
                  <Lock className="h-4 w-4 mx-auto mb-2" />
                  This paper is not yet published
                </div>
              )}
            </div>

            {/* Research Stage */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Research Stage
              </h3>
              <Badge 
                variant="outline" 
                className={`${STAGE_COLORS[paper.stage as keyof typeof STAGE_COLORS] || STAGE_COLORS.default} w-full justify-center py-2`}
              >
                {paper.stage}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
