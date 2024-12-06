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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { initializeEthers } from "@/app/web3/function";

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

      // Then start similarity checks
      setIsLoadingGemini(true);
      const pendingPatents = data.filter((tm: Patent) => tm.status === "Pending");
      const acceptedPatents = data.filter((tm: Patent) => tm.status === "Accepted");

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
      setError(err instanceof Error ? err.message : "Failed to fetch patents");
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
    
    const commonWords = words1.filter(word => set2.has(word));
    return (commonWords.length * 2) / (set1.size + set2.size);
  };

  const handleStatusUpdate = async (status: "Accepted" | "Rejected") => {
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
          description: `Patent ${status.toLowerCase()} successfully. Transaction confirmed!`
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patent Applications</h1>
        {isLoadingGemini && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Analyzing similarities...
          </div>
        )}
      </div>

      {isLoadingPatents ? (
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading patents...</p>
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
