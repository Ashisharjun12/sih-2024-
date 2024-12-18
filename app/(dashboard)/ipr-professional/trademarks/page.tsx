"use client";

import { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FileText, FileCheck, X } from "lucide-react";
import { motion } from "framer-motion";

interface IPROwner {
  _id: string;
  startupName?: string;
  name?: string;
  email: string;
}

interface Trademark {
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

export default function TrademarksPage() {
  const [trademarks, setTrademarks] = useState<Trademark[]>([]);
  const [selectedTrademark, setSelectedTrademark] = useState<Trademark | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [similarityData, setSimilarityData] = useState<Record<string, SimilarityInfo>>({});
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [isLoadingTrademarks, setIsLoadingTrademarks] = useState(true);
  const [selectedPendingTrademark, setSelectedPendingTrademark] = useState<Trademark | null>(null);
  const [analyzingPair, setAnalyzingPair] = useState<{
    pending: Trademark | null;
    accepted: Trademark | null;
  }>({ pending: null, accepted: null });
  const [showSimilarityResults, setShowSimilarityResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchTrademarks();
    checkWalletConnection();
    if (window.ethereum) {
      (async () => {
        const currentContract = await initializeEthers(window.ethereum);
        setContract(currentContract);
      })();
    }
  }, []);

  const checkWalletConnection = async () => {
    const { ethereum } = window;
    if (ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0].address);
        }
        if(!contract){
          const currentContract = await initializeEthers(window.ethereum);
          setContract(currentContract);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      // Initialize contract
      const currentContract = await initializeEthers(window.ethereum);
      setContract(currentContract);

      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setWalletAddress(accounts[0]);
        toast({
          title: "Success",
          description: "Wallet connected successfully",
        });
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchTrademarks = async () => {
    try {
      setIsLoadingTrademarks(true);
      const response = await fetch("/api/ipr-professional/types/trademarks");
      if (!response.ok) {
        throw new Error("Failed to fetch trademarks");
      }
      const data = await response.json();
      
      // Set trademarks immediately to show static data
      setTrademarks(data);
      setIsLoadingTrademarks(false);

      // Then start similarity checks
      setIsLoadingGemini(true);
      const pendingTrademarks = data.filter((tm: Trademark) => tm.status === "Pending");
      const acceptedTrademarks = data.filter((tm: Trademark) => tm.status === "Accepted");

      // Process similarities with delay between requests
      for (const pending of pendingTrademarks) {
          let highestTitleSimilarity = 0;
          let highestDescSimilarity = 0;
          let mostSimilarTitle = "";

          for (const accepted of acceptedTrademarks) {
          try {
            // Add delay between requests
            await delay(1000); // 1 second delay

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
      setError(err instanceof Error ? err.message : "Failed to fetch trademarks");
    } finally {
      setIsLoadingTrademarks(false);
      setIsLoadingGemini(false);
    }
  };

  const checkSimilarityWithGemini = async (
    pending: { title: string; description: string },
    accepted: { title: string; description: string }
  ) => {
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
    if (!selectedTrademark || !contract) return;
    setIsSubmitting(true);
    setTransactionInProgress(true);

    try {
      // First update the status in database
      const response = await fetch(
        `/api/ipr-professional/${selectedTrademark?._id}`,
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
        throw new Error("Failed to update trademark status");
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

        // Update transaction hash in database
        await fetch(
          `/api/ipr-professional/${selectedTrademark._id}/transactionHash`,
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
          description: `Trademark ${status.toLowerCase()} successfully. Transaction confirmed!`
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

      await fetchTrademarks();
      setSelectedTrademark(null);
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

  const getStatusColor = (status: Trademark["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Accepted":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const analyzeSelectedTrademark = async () => {
    if (!selectedPendingTrademark) return;
    
    setIsAnalyzing(true);
    setShowSimilarityResults(false);
    try {
      const acceptedTrademarks = trademarks.filter(p => p.status === "Accepted");
      let highestTitleSimilarity = 0;
      let highestDescSimilarity = 0;
      let mostSimilarTitle = "";

      // Clear previous similarity data for this trademark
      setSimilarityData(prev => {
        const newData = { ...prev };
        delete newData[selectedPendingTrademark._id];
        return newData;
      });

      for (const accepted of acceptedTrademarks) {
        setAnalyzingPair({
          pending: selectedPendingTrademark,
          accepted
        });
        
        await delay(1000);
        const similarity = await checkSimilarityWithGemini(
          { title: selectedPendingTrademark.title, description: selectedPendingTrademark.description },
          { title: accepted.title, description: accepted.description }
        );

        console.log('Similarity result:', similarity); // Debug log

        if (similarity) {
          const titleSim = Number(similarity.titleSimilarity);
          const descSim = Number(similarity.descriptionSimilarity);

          if (titleSim > highestTitleSimilarity || descSim > highestDescSimilarity) {
            highestTitleSimilarity = titleSim;
            highestDescSimilarity = descSim;
            mostSimilarTitle = accepted.title;

            // Update similarity data immediately for each higher match
            setSimilarityData(prev => ({
              ...prev,
              [selectedPendingTrademark._id]: {
                similarTo: mostSimilarTitle,
                titleSimilarity: Math.round(highestTitleSimilarity),
                descriptionSimilarity: Math.round(highestDescSimilarity)
              }
            }));
          }
        }
      }

      // Ensure final similarity data is set even if no matches found
      setSimilarityData(prev => ({
        ...prev,
        [selectedPendingTrademark._id]: {
          similarTo: mostSimilarTitle || "No similar trademarks found",
          titleSimilarity: Math.round(highestTitleSimilarity),
          descriptionSimilarity: Math.round(highestDescSimilarity)
        }
      }));

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

  return (
    <div className="container py-6 space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent p-6 md:p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Trademark Applications</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Review and manage trademark applications
            </p>
          </div>
          {isLoadingGemini && (
            <div className="text-sm text-muted-foreground flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              Analyzing similarities...
            </div>
          )}
        </div>
      </div>

      {selectedPendingTrademark && (
        <div className="mt-4 p-6 bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Selected Trademark for Analysis</h3>
              <p className="text-sm text-muted-foreground">{selectedPendingTrademark.title}</p>
              <p className="text-xs text-muted-foreground">Filed on: {format(new Date(selectedPendingTrademark.filingDate), "PP")}</p>
            </div>
            <Button
              onClick={analyzeSelectedTrademark}
              disabled={isAnalyzing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                "Analyze Selected Trademark"
              )}
            </Button>
          </div>

          {/* Analysis Results for Selected Trademark */}
          {similarityData[selectedPendingTrademark._id] && (
            <div className="mt-4 space-y-4">
              <div className="bg-teal/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Similarity Analysis Results</span>
                  <Badge variant={
                    Math.max(
                      similarityData[selectedPendingTrademark._id].titleSimilarity,
                      similarityData[selectedPendingTrademark._id].descriptionSimilarity
                    ) > 70 ? "destructive" : "secondary"
                  }>
                    {Math.max(
                      similarityData[selectedPendingTrademark._id].titleSimilarity,
                      similarityData[selectedPendingTrademark._id].descriptionSimilarity
                    )}% Max Similarity
                  </Badge>
                </div>

                {similarityData[selectedPendingTrademark._id].titleSimilarity > 0 ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Title Similarity</span>
                        <span className="font-medium">{similarityData[selectedPendingTrademark._id].titleSimilarity}%</span>
                      </div>
                      <div className="relative h-2 bg-emerald-400 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${similarityData[selectedPendingTrademark._id].titleSimilarity}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full",
                            similarityData[selectedPendingTrademark._id].titleSimilarity > 70
                              ? "bg-red-500"
                              : "bg-emerald-500"
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Description Similarity</span>
                        <span className="font-medium">{similarityData[selectedPendingTrademark._id].descriptionSimilarity}%</span>
                      </div>
                      <div className="relative h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${similarityData[selectedPendingTrademark._id].descriptionSimilarity}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full",
                            similarityData[selectedPendingTrademark._id].descriptionSimilarity > 70
                              ? "bg-red-500"
                              : "bg-emerald-500"
                          )}
                        />
                      </div>
                    </div>

                    {similarityData[selectedPendingTrademark._id].similarTo && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Most similar to: <span className="font-medium">{similarityData[selectedPendingTrademark._id].similarTo}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No significant similarities found with existing trademarks
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoadingTrademarks ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading trademark applications...</p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[40%]">Title</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Filing Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trademarks.map((trademark) => (
                      <TableRow 
                        key={trademark._id} 
                        className={cn(
                          "group cursor-pointer transition-colors",
                          selectedPendingTrademark?._id === trademark._id && "bg-emerald-300/50 hover:bg-emerald-200/70",
                          trademark.status === "Pending" && "hover:bg-green-50/50"
                        )}
                        onClick={() => {
                          if (trademark.status === "Pending") {
                            setSelectedPendingTrademark(trademark === selectedPendingTrademark ? null : trademark);
                          }
                        }}
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{trademark.title}</div>
                            {trademark.status === "Pending" && similarityData[trademark._id] && (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Title Match:</span>
                                  <Badge variant={similarityData[trademark._id].titleSimilarity > 70 ? "destructive" : "secondary"}
                                    className="px-2 py-0 text-xs">
                                    {similarityData[trademark._id].titleSimilarity}%
                                  </Badge>
                                  {similarityData[trademark._id].titleSimilarity > 70 && (
                                    <span className="text-xs text-red-500/80">
                                      Similar to: {similarityData[trademark._id].similarTo}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Description Match:</span>
                                  <Badge variant={similarityData[trademark._id].descriptionSimilarity > 70 ? "destructive" : "secondary"}
                                    className="px-2 py-0 text-xs">
                                    {similarityData[trademark._id].descriptionSimilarity}%
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{trademark.ownerType === "Startup" ? trademark.owner.startupName : trademark.owner.name}</span>
                            <span className="text-xs text-muted-foreground">{trademark.ownerType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {format(new Date(trademark.filingDate), "PP")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn(
                            "px-2 py-0.5",
                            trademark.status === "Pending" && "bg-yellow-500/15 text-yellow-600",
                            trademark.status === "Accepted" && "bg-emerald-500/15 text-emerald-600",
                            trademark.status === "Rejected" && "bg-red-500/15 text-red-600"
                          )}>
                            {trademark.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={trademark.status === "Pending" ? "default" : "secondary"}
                            size="sm"
                            onClick={() => setSelectedTrademark(trademark)}
                            className={cn(
                              "transition-all",
                              trademark.status === "Pending" ? "bg-emerald-600 hover:bg-emerald-700" : ""
                            )}
                          >
                            {trademark.status === "Pending" ? "Review" : "View"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {trademarks.map((trademark) => (
              <div
                key={trademark._id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-4 space-y-3">
                  {/* Title and Status */}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium">{trademark.title}</h3>
                    <Badge variant="secondary" className={cn(
                      "px-2 py-0.5 whitespace-nowrap",
                      trademark.status === "Pending" && "bg-yellow-500/15 text-yellow-600",
                      trademark.status === "Accepted" && "bg-emerald-500/15 text-emerald-600",
                      trademark.status === "Rejected" && "bg-red-500/15 text-red-600"
                    )}>
                      {trademark.status}
                    </Badge>
                  </div>

                  {/* Owner Info */}
                  <div className="flex flex-col gap-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Owner: </span>
                      <span className="font-medium">
                        {trademark.ownerType === "Startup" ? trademark.owner.startupName : trademark.owner.name}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Filed on: </span>
                      <span>{format(new Date(trademark.filingDate), "PP")}</span>
                    </div>
                  </div>

                  {/* Similarity Data */}
                  {trademark.status === "Pending" && similarityData[trademark._id] && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Title Match:</span>
                          <Badge variant={similarityData[trademark._id].titleSimilarity > 70 ? "destructive" : "secondary"}
                            className="px-2 py-0 text-xs">
                            {similarityData[trademark._id].titleSimilarity}%
                          </Badge>
                        </div>
                        {similarityData[trademark._id].titleSimilarity > 70 && (
                          <p className="text-xs text-green-500/80">
                            Similar to: {similarityData[trademark._id].similarTo}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Description Match:</span>
                          <Badge variant={similarityData[trademark._id].descriptionSimilarity > 70 ? "destructive" : "secondary"}
                            className="px-2 py-0 text-xs">
                            {similarityData[trademark._id].descriptionSimilarity}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      variant={trademark.status === "Pending" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSelectedTrademark(trademark)}
                      className={cn(
                        "transition-all",
                        trademark.status === "Pending" ? "bg-emerald-600 hover:bg-emerald-700" : ""
                      )}
                    >
                      {trademark.status === "Pending" ? "Review" : "View"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Sheet */}
      <Sheet open={!!selectedTrademark} onOpenChange={() => setSelectedTrademark(null)}>
        <SheetContent side="bottom" className="h-[90vh] p-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              {/* Add Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full hover:bg-emerald-600/10"
                onClick={() => setSelectedTrademark(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              {isWalletConnected ? (
                <>
                  <SheetHeader className="space-y-1 pr-8">
                    <SheetTitle className="text-xl font-semibold">
                      {selectedTrademark?.title}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                      Review trademark application details
                    </p>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                      <p className="text-sm">{selectedTrademark?.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">Owner Details</h3>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="font-medium">
                            {selectedTrademark?.ownerType === "Startup"
                              ? selectedTrademark.owner.startupName
                              : selectedTrademark?.owner.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedTrademark?.owner.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">Filing Information</h3>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="font-medium">
                            {selectedTrademark && format(new Date(selectedTrademark.filingDate), "PPP")}
                          </p>
                          <p className="text-sm text-muted-foreground">Submission Date</p>
                        </div>
                      </div>
                    </div>

                    {/* Documents Section */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">Related Documents</h3>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        {selectedTrademark?.relatedDocuments.length ? (
                          <div className="grid gap-2">
                            {selectedTrademark.relatedDocuments.map((doc, index) => (
                              <a
                                key={doc.public_id}
                                href={doc.secure_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/5 p-2 rounded-md transition-colors"
                              >
                                <FileText className="h-4 w-4" />
                                <span>Document {index + 1}</span>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No documents attached</p>
                        )}
                      </div>
                    </div>

                    {/* Wallet Address Section */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">Wallet Address</h3>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-mono">{walletAddress}</p>
                      </div>
                    </div>

                    {selectedTrademark?.status === "Pending" ? (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm text-muted-foreground">Review Message</h3>
                          <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your review message..."
                            className="resize-none"
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleStatusUpdate("Accepted")}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            disabled={isSubmitting || !message || transactionInProgress}
                          >
                            {transactionInProgress ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                              </>
                            ) : "Accept"}
                          </Button>
                          <Button
                            onClick={() => handleStatusUpdate("Rejected")}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={isSubmitting || !message || transactionInProgress}
                          >
                            {transactionInProgress ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                              </>
                            ) : "Reject"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      selectedTrademark?.transactionHash && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm text-muted-foreground">Transaction Details</h3>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <a
                              href={`https://sepolia.etherscan.io/tx/${selectedTrademark.transactionHash}#eventlog`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-emerald-500 hover:text-emerald-600 break-all"
                            >
                              {selectedTrademark.transactionHash}
                            </a>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <>
                  <SheetHeader>
                    <SheetTitle>Connect Your Wallet</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="bg-emerald-500/10 p-4 rounded-full">
                      <FileCheck className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="text-center text-muted-foreground">
                      Please connect your MetaMask wallet to review trademark applications
                    </p>
                    <Button 
                      onClick={connectWallet}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Connect MetaMask
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

