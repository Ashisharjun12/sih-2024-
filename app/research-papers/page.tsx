"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Search, GraduationCap, Building2, Lock, Unlock } from "lucide-react";

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  publicationDate: string;
  stage: string;
  doi?: string;
  isFree: boolean;
  price?: number;
  isPublished: boolean;
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

export default function ResearchPapersPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/research-papers');
        
        if (!response.ok) {
          throw new Error("Failed to fetch papers");
        }
        
        const data = await response.json();
        if (data.success) {
          setPapers(data.papers);
        } else {
          throw new Error(data.message || "Failed to fetch papers");
        }
      } catch (error) {
        console.error("Error fetching papers:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch papers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [toast]);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.researcher?.personalInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.researcher?.academicInfo.institution.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch && paper.isPublished;
  });

  if (loading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-cyan-500/10" />
        <div className="relative container py-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Research Papers</h1>
              <p className="text-muted-foreground mt-2">
                Explore and discover academic research papers
              </p>
            </div>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="container py-8">
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No papers found</h3>
            <p className="text-muted-foreground">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPapers.map((paper, index) => (
              <motion.div
                key={paper._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => router.push(`/explore/research-papers/${paper._id}`)}
                className="cursor-pointer group"
              >
                <div className="h-full rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300 space-y-4">
                  {/* Access Badge */}
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className={paper.isFree ? "bg-emerald-500/10 text-emerald-700" : "bg-blue-500/10 text-blue-700"}>
                      {paper.isFree ? (
                        <><Unlock className="h-3 w-3 mr-1" />Free Access</>
                      ) : (
                        <><Lock className="h-3 w-3 mr-1" />₹{paper.price}</>
                      )}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {paper.description}
                    </p>
                  </div>

                  {/* Researcher Info */}
                  {paper.researcher && (
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {paper.researcher.personalInfo.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{paper.researcher.academicInfo.institution}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
