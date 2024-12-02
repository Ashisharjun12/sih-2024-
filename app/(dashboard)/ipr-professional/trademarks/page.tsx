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
  DialogDescription,
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

const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Convert strings to arrays of words
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  // Create Sets from arrays
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  // Convert back to array for filtering
  const commonWords = words1.filter(word => set2.has(word));
  const similarity = (commonWords.length * 2) / (set1.size + set2.size);
  
  return similarity;
};

const checkForSimilarTrademarks = (
  pending: Array<{ title: string; description: string; owner: string }>,
  accepted: Array<{ title: string; description: string; owner: string }>
) => {
  const similarityThreshold = 0.7; // 70% similarity threshold
  const matches = [];

  for (const pendingTM of pending) {
    for (const acceptedTM of accepted) {
      const titleSimilarity = calculateSimilarity(pendingTM.title, acceptedTM.title);
      const descSimilarity = calculateSimilarity(pendingTM.description, acceptedTM.description);
      
      if (titleSimilarity > similarityThreshold || descSimilarity > similarityThreshold) {
        matches.push({
          pending: pendingTM,
          accepted: acceptedTM,
          titleSimilarity: Math.round(titleSimilarity * 100),
          descriptionSimilarity: Math.round(descSimilarity * 100)
        });
      }
    }
  }

  return matches;
};

const testTrademarkMatching = () => {
  // Test cases
  const testPending = [
    {
      title: "Smart AI Solutions",
      description: "AI software for business automation",
      owner: "Company A"
    },
    {
      title: "Cloud Computing Services",
      description: "Cloud infrastructure solutions",
      owner: "Company B"
    }
  ];

  const testAccepted = [
    {
      title: "AI Smart Solutions",
      description: "Business automation using artificial intelligence",
      owner: "Company C"
    },
    {
      title: "Digital Cloud Services",
      description: "Enterprise cloud computing platform",
      owner: "Company D"
    }
  ];

  console.log("\n=== Testing Trademark Matching ===");
  console.log("Test Pending Trademarks:", testPending);
  console.log("Test Accepted Trademarks:", testAccepted);

  const matches = checkForSimilarTrademarks(testPending, testAccepted);
  
  if (matches.length > 0) {
    console.log("\nFound Similar Trademarks:");
    matches.forEach((match, index) => {
      console.log(`\nMatch ${index + 1}:`);
      console.log(`Pending: "${match.pending.title}" - ${match.pending.description}`);
      console.log(`Similar to: "${match.accepted.title}" - ${match.accepted.description}`);
      console.log(`Title Similarity: ${match.titleSimilarity}%`);
      console.log(`Description Similarity: ${match.descriptionSimilarity}%`);
    });
  } else {
    console.log("\nNo similar trademarks found");
  }
};

const checkSimilarityWithGemini = async (
  pending: { title: string; description: string },
  accepted: { title: string; description: string }
) => {
  try {
    const response = await fetch("/api/gemini/compare-trademarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pending,
        accepted,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to check similarity");
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking similarity:", error);
    return null;
  }
};

const TrademarksPage = () => {
  const [trademarks, setTrademarks] = useState<Trademark[]>([]);
  const [selectedTrademark, setSelectedTrademark] = useState<Trademark | null>(
    null
  );
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
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0].address);
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

  const fetchTrademarks = async () => {
    try {
      setIsLoadingTrademarks(true);
      const response = await fetch("/api/ipr-professional/types/trademarks");
      if (!response.ok) {
        throw new Error("Failed to fetch trademarks");
      }
      const data = await response.json();

      // Set trademarks immediately
      setTrademarks(data);
      setIsLoadingTrademarks(false);

      // Then start similarity checks
      setIsLoadingGemini(true);
      const pendingTrademarks = data.filter((tm: Trademark) => tm.status === "Pending");
      const acceptedTrademarks = data.filter((tm: Trademark) => tm.status === "Accepted");

      // Process similarities in batches to avoid rate limits
      const similarities: Record<string, SimilarityInfo> = {};
      
      for (const pending of pendingTrademarks as Trademark[]) {
        let highestTitleSimilarity = 0;
        let highestDescSimilarity = 0;
        let mostSimilarTitle = "";

        for (const accepted of acceptedTrademarks as Trademark[]) {
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
        }

        if (highestTitleSimilarity > 0 || highestDescSimilarity > 0) {
          similarities[pending._id] = {
            similarTo: mostSimilarTitle,
            titleSimilarity: Math.round(highestTitleSimilarity),
            descriptionSimilarity: Math.round(highestDescSimilarity)
          };
          // Update similarities progressively
          setSimilarityData(prev => ({ ...prev, [pending._id]: similarities[pending._id] }));
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trademarks");
    } finally {
      setIsLoadingTrademarks(false);
      setIsLoadingGemini(false);
    }
  };

  const handleStatusUpdate = async (iprId: string, status: string, message: string) => {
    try {
      console.log("Updating trademark:", {
        iprId,
        status,
        message,
        selectedTrademark: selectedTrademark
      });

      // Validate required data
      if (!iprId || !status || !selectedTrademark) {
        toast({
          title: "Error",
          description: "Missing required information",
          variant: "destructive",
        });
        return;
      }

      if (!contract) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      setTransactionInProgress(true);

      // Rest of your function...
      const response = await fetch(`/api/ipr-professional/${iprId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to update trademark status");
      }

      const data = await response.json();
      
      // Show success message
      toast({
        title: "Success",
        description: "Trademark status updated successfully",
      });

      // Refresh and reset
      await fetchTrademarks();
      setSelectedTrademark(null);
      setMessage("");

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
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

  if (isLoadingTrademarks) {
    return <div className="p-6">Loading trademarks...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trademark Applications</h1>
        {isLoadingGemini && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Analyzing similarities...
          </div>
        )}
      </div>

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
          {trademarks.map((trademark) => (
            <TableRow key={trademark._id}>
              <TableCell>
                <div className="space-y-1">
                  <div>{trademark.title}</div>
                  {trademark.status === "Pending" && (
                    <div className="text-xs text-muted-foreground">
                      {similarityData[trademark._id] ? (
                        <div className="flex items-center gap-2">
                          <span>Title Similarity: </span>
                          <Badge variant={similarityData[trademark._id].titleSimilarity > 70 ? "destructive" : "secondary"}>
                            {similarityData[trademark._id].titleSimilarity}%
                          </Badge>
                          {similarityData[trademark._id].titleSimilarity > 70 && (
                            <span className="text-xs text-red-500">
                              Similar to: {similarityData[trademark._id].similarTo}
                            </span>
                          )}
                        </div>
                      ) : isLoadingGemini && (
                        <div className="text-xs">Analyzing similarity...</div>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{trademark.description}</div>
                  {trademark.status === "Pending" && similarityData[trademark._id] && (
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>Description Similarity: </span>
                        <Badge variant={similarityData[trademark._id].descriptionSimilarity > 70 ? "destructive" : "secondary"}>
                          {similarityData[trademark._id].descriptionSimilarity}%
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(trademark.filingDate), "PP")}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(trademark.status)}
                >
                  {trademark.status}
                </Badge>
              </TableCell>
              <TableCell>
                {trademark.status === "Pending" ? (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTrademark(trademark)}
                  >
                    Review
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedTrademark(trademark)}
                  >
                    View
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Trademark Review Dialog */}
      <Dialog
        open={!!selectedTrademark}
        onOpenChange={() => setSelectedTrademark(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTrademark?.title}</DialogTitle>
            <DialogDescription>
              Review trademark application details
            </DialogDescription>
          </DialogHeader>
          {isWalletConnected ? (
            <>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-600">
                    {selectedTrademark?.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Owner</h3>
                    <p className="text-gray-600">
                      {selectedTrademark?.ownerType === "Startup"
                        ? selectedTrademark.owner.startupName
                        : selectedTrademark?.owner.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedTrademark?.owner.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Filing Date</h3>
                    <p className="text-gray-600">
                      {selectedTrademark &&
                        format(new Date(selectedTrademark.filingDate), "PP")}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Related Documents</h3>
                  <div className="mt-2">
                    {selectedTrademark?.relatedDocuments.map((doc, index) => (
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

                {selectedTrademark?.status === "Pending" ? (
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
                        onClick={() => handleStatusUpdate(selectedTrademark._id, "Accepted", message)}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        disabled={
                          isSubmitting || !message || transactionInProgress
                        }
                      >
                        {transactionInProgress ? "Processing..." : "Accept"}
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(selectedTrademark._id, "Rejected", message)}
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
                    {selectedTrademark?.transactionHash && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Transaction Hash</h3>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${selectedTrademark.transactionHash}#eventlog`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline break-all"
                        >
                          {selectedTrademark.transactionHash}
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
                  Please connect your MetaMask wallet to review trademark
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

export default TrademarksPage;
