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
import { cn } from "@/lib/utils";
import { FileText, FileCheck, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import crypto from 'crypto';

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
  status: "Pending" | "Accepted" | "Rejected" | "Basic Details" | "Document verified";
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


const secretKey = 'your-secret-key';

const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export default function PatentsPage() {
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

  const { toast } = useToast();

  useEffect(() => {
    fetchPatents();
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
        if (!contract) {
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

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchPatents = async () => {
    try {
      setIsLoadingPatents(true);
      const response = await fetch("/api/ipr-professional/types/patents");
      if (!response.ok) {
        throw new Error("Failed to fetch patent secrets");
      }
      const data = await response.json();

      // Set patents immediately to show static data
      setPatents(data);
      setIsLoadingPatents(false);

      // Then start similarity checks
      setIsLoadingGemini(true);
      const pendingPatents = data.filter(
        (ts: Patent) => ts.status === "Pending"
      );
      const acceptedPatents = data.filter(
        (ts: Patent) => ts.status === "Accepted"
      );

      // Process similarities with delay between requests
      for (const pending of pendingPatents) {
        let highestTitleSimilarity = 0;
        let highestDescSimilarity = 0;
        let mostSimilarTitle = "";

        for (const accepted of acceptedPatents) {
          try {
            // Add delay between requests
            await delay(1000); // 1 second delay

            const similarity = await checkSimilarityWithGemini(
              { title: pending.title, description: pending.description },
              { title: accepted.title, description: accepted.description }
            );

            if (similarity) {
              if (
                similarity.titleSimilarity > highestTitleSimilarity ||
                similarity.descriptionSimilarity > highestDescSimilarity
              ) {
                highestTitleSimilarity = similarity.titleSimilarity;
                highestDescSimilarity = similarity.descriptionSimilarity;
                mostSimilarTitle = accepted.title;
              }
            }
          } catch (error) {
            // If rate limit hit, use basic similarity check
            const titleSimilarity = calculateBasicSimilarity(
              pending.title,
              accepted.title
            );
            const descSimilarity = calculateBasicSimilarity(
              pending.description,
              accepted.description
            );

            if (
              titleSimilarity > highestTitleSimilarity ||
              descSimilarity > highestDescSimilarity
            ) {
              highestTitleSimilarity = titleSimilarity * 100;
              highestDescSimilarity = descSimilarity * 100;
              mostSimilarTitle = accepted.title;
            }
          }
        }

        if (highestTitleSimilarity > 0 || highestDescSimilarity > 0) {
          setSimilarityData((prev) => ({
            ...prev,
            [pending._id]: {
              similarTo: mostSimilarTitle,
              titleSimilarity: Math.round(highestTitleSimilarity),
              descriptionSimilarity: Math.round(highestDescSimilarity),
            },
          }));
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch patents"
      );
    } finally {
      setIsLoadingPatents(false);
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

    const commonWords = words1.filter((word) => set2.has(word));
    return (commonWords.length * 2) / (set1.size + set2.size);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedPatent || !contract) return;
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



      try {
        let transaction;
        // Then handle blockchain transaction
        const id = BigInt(parseInt(data.ipr._id.toString(), 16)).toString();
        const encryptedId = encrypt(id);
        const title = data.ipr.title;
        const decryptedId = encrypt(title);
        const ownerId = BigInt(
          parseInt(data.ipr.owner.details._id.toString(), 16)
        ).toString();
        const encryptedOwnerId = encrypt(ownerId);
        if (status === "Accepted") {
          transaction = await contract.acceptPatent(encryptedId, decryptedId, encryptedOwnerId);
        } else if (status === "Rejected") {
          transaction = await contract.rejectPatent(encryptedId, decryptedId, encryptedOwnerId);
        }

        if (status === "Accepted" || status === "Rejected") {
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
        }
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

  const getStatusColor = (status: Patent["status"]) => {
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

  return (
    <div className="container py-6 space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent p-6 md:p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Patent Applications
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Review and manage patent applications
            </p>
          </div>
          {isLoadingGemini && (
            <div className="text-sm text-muted-foreground flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              Analyzing similarities...
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoadingPatents ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading patent applications...
            </p>
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
                    {patents.map((secret) => (
                      <TableRow key={secret._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              {secret.title}
                            </div>
                            {secret.status === "Pending" &&
                              similarityData[secret._id] && (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      Title Match:
                                    </span>
                                    <Badge
                                      variant={
                                        similarityData[secret._id]
                                          .titleSimilarity > 70
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      className="px-2 py-0 text-xs"
                                    >
                                      {
                                        similarityData[secret._id]
                                          .titleSimilarity
                                      }
                                      %
                                    </Badge>
                                    {similarityData[secret._id]
                                      .titleSimilarity > 70 && (
                                        <span className="text-xs text-red-500/80">
                                          Similar to:{" "}
                                          {similarityData[secret._id].similarTo}
                                        </span>
                                      )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      Description Match:
                                    </span>
                                    <Badge
                                      variant={
                                        similarityData[secret._id]
                                          .descriptionSimilarity > 70
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      className="px-2 py-0 text-xs"
                                    >
                                      {
                                        similarityData[secret._id]
                                          .descriptionSimilarity
                                      }
                                      %
                                    </Badge>
                                  </div>
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {secret.ownerType === "Startup"
                                ? secret.owner.startupName
                                : secret.owner.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {secret.ownerType}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {format(new Date(secret.filingDate), "PP")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "px-2 py-0.5",
                              secret.status === "Pending" &&
                              "bg-yellow-500/15 text-yellow-600",
                              secret.status === "Accepted" &&
                              "bg-teal-500/15 text-teal-600",
                              secret.status === "BasicDetails" &&
                              "bg-blue-500/15 text-teal-600",
                              secret.status === "DocumentVerified" &&
                              "bg-blue-500/15 text-teal-600",
                              secret.status === "Rejected" &&
                              "bg-red-500/15 text-red-600"
                            )}
                          >
                            {secret.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={
                              secret.status !== "Accepted"
                                ? "default"
                                : "secondary"
                            }
                            size="sm"
                            onClick={() => setSelectedPatent(secret)}
                            className={cn(
                              "transition-all",
                              secret.status !== "Accepted"
                                ? "bg-teal-600 hover:bg-teal-700"
                                : ""
                            )}
                          >
                            {secret.status !== "Accepted" ? "Review" : "View"}
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
            {patents.map((secret) => (
              <div
                key={secret._id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-4 space-y-3">
                  {/* Title and Status */}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium flex items-center gap-2">
                      {secret.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "px-2 py-0.5 whitespace-nowrap",
                        secret.status === "Pending" &&
                        "bg-yellow-500/15 text-yellow-600",
                        secret.status === "Accepted" &&
                        "bg-sky-500/15 text-teal-600",
                        secret.status === "Rejected" &&
                        "bg-red-500/15 text-red-600"
                      )}
                    >
                      {secret.status}
                    </Badge>
                  </div>

                  {/* Owner Info */}
                  <div className="flex flex-col gap-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Owner: </span>
                      <span className="font-medium">
                        {secret.ownerType === "Startup"
                          ? secret.owner.startupName
                          : secret.owner.name}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Filed on: </span>
                      <span>{format(new Date(secret.filingDate), "PP")}</span>
                    </div>
                  </div>

                  {/* Similarity Data */}
                  {secret.status === "Pending" &&
                    similarityData[secret._id] && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Title Match:
                            </span>
                            <Badge
                              variant={
                                similarityData[secret._id].titleSimilarity > 70
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="px-2 py-0 text-xs"
                            >
                              {similarityData[secret._id].titleSimilarity}%
                            </Badge>
                          </div>
                          {similarityData[secret._id].titleSimilarity > 70 && (
                            <p className="text-xs text-red-500/80">
                              Similar to: {similarityData[secret._id].similarTo}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Description Match:
                            </span>
                            <Badge
                              variant={
                                similarityData[secret._id]
                                  .descriptionSimilarity > 70
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="px-2 py-0 text-xs"
                            >
                              {similarityData[secret._id].descriptionSimilarity}
                              %
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Action Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      variant={
                        secret.status !== "Accepted" ? "default" : "secondary"
                      }
                      size="sm"
                      onClick={() => setSelectedPatent(secret)}
                      className={cn(
                        "transition-all",
                        secret.status !== "Accepted"
                          ? "bg-teal-600 hover:bg-teal-700"
                          : ""
                      )}
                    >
                      {secret.status !== "Accepted" ? "Review" : "View"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Sheet */}
      <Sheet
        open={!!selectedPatent}
        onOpenChange={() => setSelectedPatent(null)}
      >
        <SheetContent side="bottom" className="h-[90vh] p-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              {/* Add Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full hover:bg-teal-500/10"
                onClick={() => setSelectedPatent(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              {isWalletConnected ? (
                <>
                  <SheetHeader className="space-y-1 pr-8">
                    <SheetTitle className="text-xl font-semibold flex items-center gap-2">
                      {selectedPatent?.title}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                      Review patent application details
                    </p>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Description
                      </h3>
                      <p className="text-sm">{selectedPatent?.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Owner Details
                        </h3>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="font-medium">
                            {selectedPatent?.ownerType === "Startup"
                              ? selectedPatent.owner.startupName
                              : selectedPatent?.owner.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatent?.owner.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Filing Information
                        </h3>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="font-medium">
                            {selectedPatent &&
                              format(
                                new Date(selectedPatent.filingDate),
                                "PPP"
                              )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submission Date
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Similarity Analysis Section */}
                    {selectedPatent && similarityData[selectedPatent._id] && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Similarity Analysis
                        </h3>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Title Similarity:</span>
                              <Badge
                                variant={
                                  similarityData[selectedPatent._id]
                                    .titleSimilarity > 70
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="px-2 py-0.5"
                              >
                                {
                                  similarityData[selectedPatent._id]
                                    .titleSimilarity
                                }
                                % Match
                              </Badge>
                            </div>
                            {similarityData[selectedPatent._id]
                              .titleSimilarity > 70 && (
                                <p className="text-xs text-red-500">
                                  Similar to:{" "}
                                  {similarityData[selectedPatent._id].similarTo}
                                </p>
                              )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Description Similarity:
                            </span>
                            <Badge
                              variant={
                                similarityData[selectedPatent._id]
                                  .descriptionSimilarity > 70
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="px-2 py-0.5"
                            >
                              {
                                similarityData[selectedPatent._id]
                                  .descriptionSimilarity
                              }
                              % Match
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Documents Section */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Related Documents
                      </h3>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        {selectedPatent?.relatedDocuments.length ? (
                          <div className="grid gap-2">
                            {selectedPatent.relatedDocuments.map(
                              (doc, index) => (
                                <a
                                  key={doc.public_id}
                                  href={doc.secure_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-teal-500 hover:text-teal-600 hover:bg-teal-500/5 p-2 rounded-md transition-colors"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span>Document {index + 1}</span>
                                </a>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No documents attached
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Wallet Address Section */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Wallet Address
                      </h3>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-mono">{walletAddress}</p>
                      </div>
                    </div>

                    {selectedPatent?.status !== "Accepted" && (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm text-muted-foreground">
                            Review Message
                          </h3>
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
                            onClick={() => handleStatusUpdate(selectedPatent.status === "Pending" ? "Basic Details" : selectedPatent.status === "Basic Details" ? "Document verified" : "Accepted")}
                            className="flex-1 bg-teal-600 hover:bg-teal-700"
                            disabled={
                              isSubmitting || !message || transactionInProgress
                            }
                          >
                            {transactionInProgress ? (
                              <>
                                <div className="w-4 h-4 border-2 border-teal-300 border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              <div>  {selectedPatent?.status === "Pending" ? "Verify Basic Details" : selectedPatent?.status === "Basic Details" ? "Verify Documents" : "Accepted"}</div>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleStatusUpdate("Rejected")}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            disabled={
                              isSubmitting || !message || transactionInProgress
                            }
                          >
                            {transactionInProgress ? (
                              <>
                                <div className="w-4 h-4 border-2 border-teal-300 border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedPatent?.status === "Accepted" && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Transaction Details
                        </h3>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <a
                            href={`https://sepolia.etherscan.io/tx/${selectedPatent.transactionHash}#eventlog`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-teal-500 hover:text-teal-600 break-all"
                          >
                            {selectedPatent.transactionHash}
                          </a>
                        </div>
                      </div>
                    )
                    }
                  </div>
                </>
              ) : (
                <>
                  <SheetHeader>
                    <SheetTitle>Connect Your Wallet</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="bg-teal-500/10 p-4 rounded-full">
                      <FileCheck className="h-8 w-8 text-teal-500" />
                    </div>
                    <p className="text-center text-muted-foreground">
                      Please connect your MetaMask wallet to review patent
                      applications
                    </p>
                    <Button
                      onClick={connectWallet}
                      className="bg-teal-600 hover:bg-teal-700"
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
