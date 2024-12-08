"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { initializeEthers } from "@/app/web3/function";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface IPROwner {
  _id: string;
  startupName?: string;
  name?: string;
  email: string;
}

interface Patent {
  _id: string;
  title: string;
  description: string;
  filingDate: string;
  status: "Pending" | "Accepted" | "Rejected";
  owner: IPROwner;
  ownerType: "Startup" | "Researcher";
  relatedDocuments: Array<{
    public_id: string;
    secure_url: string;
  }>;
  transactionHash: string;
  message?: string;
}

interface SimilarityInfo {
  similarTo: string;
  titleSimilarity: number;
  descriptionSimilarity: number;
}

const PatentsPage = () => {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [similarityData, setSimilarityData] = useState<
    Record<string, SimilarityInfo>
  >({});
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [isLoadingPatents, setIsLoadingPatents] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSimilarityResults, setShowSimilarityResults] = useState(false);
  const [analyzingPair, setAnalyzingPair] = useState<{
    pending: Patent | null;
    accepted: Patent | null;
  }>({ pending: null, accepted: null });
  const [selectedPendingPatent, setSelectedPendingPatent] = useState<Patent | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    pending: Patent | null;
    results: {
      titleSimilarity: number;
      descriptionSimilarity: number;
      similarTo: string;
    } | null;
  }>({ pending: null, results: null });
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchPatents();
  }, []);

  const fetchPatents = async () => {
    try {
      setIsLoadingPatents(true);
      const response = await fetch("/api/ipr-professional/types/patents");
      if (!response.ok) {
        throw new Error("Failed to fetch patents");
      }
      const data = await response.json();
      
      // Set patents immediately to show static data
      setPatents(data);
      setIsLoadingPatents(false);

      // Process similarities
      setIsLoadingGemini(true);
      const pendingPatents = data.filter((tm: Patent) => tm.status === "Pending");
      const acceptedPatents = data.filter((tm: Patent) => tm.status === "Accepted");

      console.log('Processing similarities for patents:', {
        pending: pendingPatents.length,
        accepted: acceptedPatents.length
      });

      for (const pending of pendingPatents) {
        let highestTitleSimilarity = 0;
        let highestDescSimilarity = 0;
        let mostSimilarTitle = "";

        for (const accepted of acceptedPatents) {
          try {
            await delay(1000);
            const similarity = await checkSimilarityWithGemini(
              { title: pending.title, description: pending.description },
              { title: accepted.title, description: accepted.description }
            );

            if (similarity) {
              if (similarity.titleSimilarity > highestTitleSimilarity || 
                  similarity.descriptionSimilarity > highestDescSimilarity) {
                highestTitleSimilarity = similarity.titleSimilarity;
                highestDescSimilarity = similarity.descriptionSimilarity;
                mostSimilarTitle = accepted.title;
              }
            }
          } catch (error) {
            // If rate limit hit, use basic similarity check
            const titleSimilarity = calculateBasicSimilarity(pending.title, accepted.title);
            const descSimilarity = calculateBasicSimilarity(pending.description, accepted.description);
            
            if (titleSimilarity > highestTitleSimilarity || descSimilarity > highestDescSimilarity) {
              highestTitleSimilarity = titleSimilarity * 100;
              highestDescSimilarity = descSimilarity * 100;
              mostSimilarTitle = accepted.title;
            }
          }
        }

        if (highestTitleSimilarity > 0 || highestDescSimilarity > 0) {
          setSimilarityData(prev => ({
            ...prev,
            [pending._id]: {
              similarTo: mostSimilarTitle,
              titleSimilarity: Math.round(highestTitleSimilarity),
              descriptionSimilarity: Math.round(highestDescSimilarity)
            }
          }));
        }
      }
    } catch (err) {
      console.error('Error in fetchPatents:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch patents");
    } finally {
      setIsLoadingPatents(false);
      setIsLoadingGemini(false);
    }
  };

  const checkWalletConnection = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/gemini/compare-trademarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pending, accepted }),
      });

      if (!response.ok) throw new Error("Failed to check similarity");
      return await response.json();
    } catch (error) {
      console.error("Error checking similarity:", error);
      return null;
    }
  };

  const calculateBasicSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const commonWords = words1.filter(word => set2.has(word));
    return (commonWords.length * 2) / (set1.size + set2.size);
  };

  const handleStatusUpdate = async (status: "Accepted" | "Rejected") => {
    if (!selectedPatent || !isWalletConnected) return;
    setIsSubmitting(true);
    setTransactionInProgress(true);

    try {
      // First update the status in database
      const response = await fetch(
        `/api/ipr-professional/${selectedPatent?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update patent status");
      }

      const data = await response.json();

      // Then handle blockchain transaction
      const id = BigInt(parseInt(data.ipr._id.toString(), 16)).toString();
      const title = data.ipr.title;
      const ownerId = BigInt(
        parseInt(data.ipr.owner.details._id.toString(), 16)
      ).toString();
      try {
        let transaction;
        if (status === "Accepted") {
          transaction = await contract.acceptPatent(id, title, ownerId);
        } else {
          transaction = await contract.rejectPatent(id, title, ownerId);
        }

        // Show transaction pending toast
        toast({
          title: "Transaction Pending",
          description:
            "Please wait while the transaction is being processed...",
        });

        // Wait for transaction confirmation
        const receipt = await transaction.wait();
        console.log(receipt.hash);
        console.log(receipt);

        // Update transaction hash in database
        await fetch(
          `/api/ipr-professional/${selectedPatent._id}/transactionHash`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transactionHash: receipt.hash,
            }),
          }
        );

        toast({
          title: "Success",
          description: `Patent ${status.toLowerCase()} successfully. Transaction confirmed!`,
        });
      } catch (error: any) {
        if (error.code === "ACTION_REJECTED") {
          toast({
            title: "Transaction Rejected",
            description: "You rejected the transaction in MetaMask",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      await fetchPatents();
      setSelectedPatent(null);
      setMessage("");
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setTransactionInProgress(false);
    }
  };

  const analyzeSimilarities = async () => {
    setIsAnalyzing(true);
    setShowSimilarityResults(false);
    try {
      const pendingPatents = patents.filter(p => p.status === "Pending");
      const acceptedPatents = patents.filter(p => p.status === "Accepted");

      for (const pending of pendingPatents) {
        let highestTitleSimilarity = 0;
        let highestDescSimilarity = 0;
        let mostSimilarTitle = "";
        let mostSimilarPatent = null;

        for (const accepted of acceptedPatents) {
          // Show which patents are being compared
          setAnalyzingPair({
            pending,
            accepted
          });
          
          await delay(1000);
          const similarity = await checkSimilarityWithGemini(
            { title: pending.title, description: pending.description },
            { title: accepted.title, description: accepted.description }
          );

          if (similarity) {
            if (similarity.titleSimilarity > highestTitleSimilarity || 
                similarity.descriptionSimilarity > highestDescSimilarity) {
              highestTitleSimilarity = similarity.titleSimilarity;
              highestDescSimilarity = similarity.descriptionSimilarity;
              mostSimilarTitle = accepted.title;
              mostSimilarPatent = accepted;
            }
          }
        }

        if (highestTitleSimilarity > 0 || highestDescSimilarity > 0) {
          setSimilarityData(prev => ({
            ...prev,
            [pending._id]: {
              similarTo: mostSimilarTitle,
              titleSimilarity: Math.round(highestTitleSimilarity),
              descriptionSimilarity: Math.round(highestDescSimilarity)
            }
          }));
        }
      }
      setShowSimilarityResults(true);
    } catch (error) {
      console.error('Error analyzing similarities:', error);
      toast({
        title: "Error",
        description: "Failed to analyze similarities",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalyzingPair({ pending: null, accepted: null });
    }
  };

  const analyzeSelectedPatent = async () => {
    if (!selectedPendingPatent) return;
    
    setIsAnalyzing(true);
    setShowSimilarityResults(false);
    setIsAnalysisReady(false);
    
    try {
      // Clear previous results
      setSimilarityData({});

      const acceptedPatents = patents.filter(p => p.status === "Accepted");
      
      // Log the comparison details for debugging
      console.log('Analyzing patent:', {
        pending: selectedPendingPatent,
        acceptedCount: acceptedPatents.length
      });

      let results = [];

      // First collect all results
      for (const accepted of acceptedPatents) {
        setAnalyzingPair({
          pending: selectedPendingPatent,
          accepted
        });

        try {
          // Add delay between requests
          await delay(1000);

          const response = await fetch("/api/gemini/compare-trademarks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pending: {
                title: selectedPendingPatent.title.trim(),
                description: selectedPendingPatent.description.trim()
              },
              accepted: {
                title: accepted.title.trim(),
                description: accepted.description.trim()
              }
            }),
          });

          if (!response.ok) throw new Error("Failed to check similarity");
          const data = await response.json();

          // Log raw response
          console.log('Similarity response:', data);

          // Parse and validate similarity values
          const titleSim = Math.min(Math.max(0, Number(data.titleSimilarity) || 0), 100);
          const descSim = Math.min(Math.max(0, Number(data.descriptionSimilarity) || 0), 100);

          // Check if patents are identical
          const isIdentical = 
            selectedPendingPatent.title.toLowerCase().trim() === accepted.title.toLowerCase().trim() &&
            selectedPendingPatent.description.toLowerCase().trim() === accepted.description.toLowerCase().trim();

          results.push({
            accepted,
            titleSimilarity: isIdentical ? 100 : titleSim,
            descriptionSimilarity: isIdentical ? 100 : descSim
          });

          // Log processed result
          console.log('Processed similarity:', {
            titleSim,
            descSim,
            isIdentical
          });
        } catch (error) {
          console.error("Error analyzing patent:", error);
        }
      }

      // Find highest similarities
      let highestTitleSimilarity = 0;
      let highestDescSimilarity = 0;
      let mostSimilarTitle = "";

      results.forEach(result => {
        if (result.titleSimilarity > highestTitleSimilarity) {
          highestTitleSimilarity = result.titleSimilarity;
          mostSimilarTitle = result.accepted.title;
        }
        if (result.descriptionSimilarity > highestDescSimilarity) {
          highestDescSimilarity = result.descriptionSimilarity;
        }
      });

      // Ensure we have valid results
      const finalResults = {
        titleSimilarity: Math.round(highestTitleSimilarity),
        descriptionSimilarity: Math.round(highestDescSimilarity),
        similarTo: mostSimilarTitle || "No similar patents found"
      };

      // Log final results
      console.log('Final similarity results:', finalResults);

      // Update similarity data
      setSimilarityData(prev => ({
        [selectedPendingPatent._id]: {
          similarTo: finalResults.similarTo,
          titleSimilarity: finalResults.titleSimilarity,
          descriptionSimilarity: finalResults.descriptionSimilarity
        }
      }));

      // Set analysis as ready and show results
      setIsAnalysisReady(true);
      await delay(100); // Small delay to ensure state updates
      setShowSimilarityResults(true);

      // Show result notification
      toast({
        title: "Analysis Complete",
        description: finalResults.titleSimilarity > 0 || finalResults.descriptionSimilarity > 0
          ? `Found ${Math.max(finalResults.titleSimilarity, finalResults.descriptionSimilarity)}% maximum similarity`
          : "No significant similarities found",
      });

    } catch (error) {
      console.error('Error analyzing similarities:', error);
      toast({
        title: "Error",
        description: "Failed to analyze similarities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalyzingPair({ pending: null, accepted: null });
    }
  };

  const handlePatentSelection = (patent: Patent) => {
    // Clear previous analysis results when selecting a new patent
    if (patent !== selectedPendingPatent) {
      setAnalysisResults({ pending: null, results: null });
      setSimilarityData({});
      setShowSimilarityResults(false);
    }
    setSelectedPendingPatent(patent === selectedPendingPatent ? null : patent);
  };

  useEffect(() => {
    if (isAnalysisReady && Object.keys(similarityData).length > 0) {
      setShowSimilarityResults(true);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Patent Applications</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Review and manage patent applications
            </p>
          </div>
       
        </div>
      </div>

      {selectedPendingPatent && (
        <div className="mt-4 p-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Selected Patent for Analysis</h3>
              <p className="text-sm text-muted-foreground">{selectedPendingPatent.title}</p>
              <p className="text-xs text-muted-foreground">Filed on: {format(new Date(selectedPendingPatent.filingDate), "PP")}</p>
            </div>
            <Button
              onClick={analyzeSelectedPatent}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                "Analyze Selected Patent"
              )}
            </Button>
          </div>

          {/* Analysis Results for Selected Patent */}
          {analysisResults.results && (
            <div className="mt-4 space-y-4">
              <div className="bg-white/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Similarity Analysis Results</span>
                  <Badge variant={
                    Math.max(
                      analysisResults.results.titleSimilarity,
                      analysisResults.results.descriptionSimilarity
                    ) > 70 ? "destructive" : "secondary"
                  }>
                    {Math.max(
                      analysisResults.results.titleSimilarity,
                      analysisResults.results.descriptionSimilarity
                    )}% Max Similarity
                  </Badge>
                </div>

                {analysisResults.results.titleSimilarity > 0 ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Title Similarity</span>
                        <span className="font-medium">{analysisResults.results.titleSimilarity}%</span>
                      </div>
                      <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisResults.results.titleSimilarity}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full",
                            analysisResults.results.titleSimilarity > 70
                              ? "bg-red-500"
                              : "bg-blue-500"
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Description Similarity</span>
                        <span className="font-medium">{analysisResults.results.descriptionSimilarity}%</span>
                      </div>
                      <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisResults.results.descriptionSimilarity}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full",
                            analysisResults.results.descriptionSimilarity > 70
                              ? "bg-red-500"
                              : "bg-blue-500"
                          )}
                        />
                      </div>
                    </div>

                    {analysisResults.results.similarTo && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Most similar to: <span className="font-medium">{analysisResults.results.similarTo}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No significant similarities found with existing patents
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {isAnalyzing && (
        <div className="relative overflow-hidden rounded-xl border bg-background p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-orange-500/10" />
          <div className="relative space-y-4">
            <h3 className="text-lg font-semibold">Analyzing Patents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pending Patent */}
              <div className={cn(
                "p-4 rounded-lg transition-all duration-300",
                analyzingPair.pending ? "bg-blue-500/10" : "bg-muted"
              )}>
                <h4 className="font-medium mb-2">Pending Patent</h4>
                {analyzingPair.pending ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <p className="font-medium">{analyzingPair.pending.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {analyzingPair.pending.description}
                    </p>
                  </motion.div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-muted-foreground">
                    Waiting for patent...
                  </div>
                )}
              </div>

              {/* Accepted Patent */}
              <div className={cn(
                "p-4 rounded-lg transition-all duration-300",
                analyzingPair.accepted ? "bg-orange-500/10" : "bg-muted"
              )}>
                <h4 className="font-medium mb-2">Comparing with Accepted Patent</h4>
                {analyzingPair.accepted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <p className="font-medium">{analyzingPair.accepted.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {analyzingPair.accepted.description}
                    </p>
                  </motion.div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-muted-foreground">
                    Waiting for patent...
                  </div>
                )}
              </div>

              {/* Connecting Line */}
              {analyzingPair.pending && analyzingPair.accepted && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-orange-500/20 
                      flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-blue-500/50 
                      animate-spin"
                    />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-full bg-gradient-to-r from-blue-500 to-orange-500"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Analyzing patent similarities...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Similarity Results Alert */}
      {showSimilarityResults && Object.keys(similarityData).length > 0 && (
        <Alert className="bg-orange-500/15 text-orange-600 border-orange-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Similarity Analysis Results</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="space-y-2">
              {Object.entries(similarityData).map(([patentId, data]) => {
                const patent = patents.find(p => p._id === patentId);
                if (!patent || data.titleSimilarity < 50) return null;
                
                return (
                  <div key={patentId} className="bg-orange-500/10 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{patent.title}</span>
                      <Badge variant="outline" className="border-orange-500/50 text-orange-600">
                        {Math.max(data.titleSimilarity, data.descriptionSimilarity)}% Match
                      </Badge>
                    </div>
                    <div className="text-sm">Similar to: {data.similarTo}</div>
                    <div className="mt-2 space-y-1">
                      <div className="relative h-2 bg-orange-500/20 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${data.titleSimilarity}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Title Similarity</span>
                        <span>{data.titleSimilarity}%</span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="relative h-2 bg-orange-500/20 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${data.descriptionSimilarity}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Description Similarity</span>
                        <span>{data.descriptionSimilarity}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoadingPatents ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading patent applications...</p>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Filing Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patents.map((patent) => (
              <TableRow key={patent._id}>
                <TableCell>
                  <div className="space-y-1">
                    <div>{patent.title}</div>
                    {patent.status === "Pending" && (
                      <div className="text-xs text-muted-foreground">
                        {similarityData[patent._id] ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span>Title Similarity:</span>
                              <Badge variant={similarityData[patent._id].titleSimilarity > 70 ? "destructive" : "secondary"}>
                                {similarityData[patent._id].titleSimilarity}%
                              </Badge>
                              {similarityData[patent._id].titleSimilarity > 70 && (
                                <span className="text-xs text-red-500">
                                  Similar to: {similarityData[patent._id].similarTo}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Description Similarity:</span>
                              <Badge variant={similarityData[patent._id].descriptionSimilarity > 70 ? "destructive" : "secondary"}>
                                {similarityData[patent._id].descriptionSimilarity}%
                              </Badge>
                            </div>
                          </div>
                        ) : isLoadingGemini && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            Analyzing similarity...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {patent.ownerType === "Startup"
                    ? patent.owner.startupName
                    : patent.owner.name}
                </TableCell>
                <TableCell>{format(new Date(patent.filingDate), "PP")}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(patent.status)}
                  >
                    {patent.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {patent.status === "Pending" ? (
                    <Button
                      variant="outline"
                      onClick={() => {setSelectedPatent(patent);
                      }}
                    >
                      Review
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedPatent(patent)}
                    >
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Patent Review Dialog */}
      <Dialog
        open={!!selectedPatent}
        onOpenChange={() => setSelectedPatent(null)}
      >
        <DialogContent className="max-w-2xl">
          {isWalletConnected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPatent?.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-600">{selectedPatent?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Owner</h3>
                    <p className="text-gray-600">
                      {selectedPatent?.ownerType === "Startup"
                        ? selectedPatent.owner.startupName
                        : selectedPatent?.owner.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedPatent?.owner.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Filing Date</h3>
                    <p className="text-gray-600">
                      {selectedPatent &&
                        format(new Date(selectedPatent.filingDate), "PP")}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Related Documents</h3>
                  <div className="mt-2">
                    {selectedPatent?.relatedDocuments.map((doc, index) => (
                      <a
                        key={doc.public_id}
                        href={doc.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block"
                      >
                        Document {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Wallet Address</h3>
                  <p className="text-gray-600">{walletAddress}</p>
                </div>

                {selectedPatent?.status === "Pending" ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Review Message</h3>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your review message..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={() => handleStatusUpdate("Accepted")}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        disabled={
                          isSubmitting || !message || transactionInProgress
                        }
                      >
                        {transactionInProgress ? "Processing..." : "Accept"}
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("Rejected")}
                        className="flex-1 bg-red-500 hover:bg-red-600"
                        disabled={
                          isSubmitting || !message || transactionInProgress
                        }
                      >
                        {transactionInProgress ? "Processing..." : "Reject"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {selectedPatent?.transactionHash && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Transaction Hash</h3>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${selectedPatent.transactionHash}#eventlog`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline break-all"
                        >
                          {selectedPatent.transactionHash}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Connect Wallet</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <p className="text-center text-gray-600">
                  Please connect your MetaMask wallet to review patent
                  applications
                </p>
                <Button onClick={connectWallet}>Connect MetaMask</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatentsPage;
