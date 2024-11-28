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

interface Copyright {
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

const CopyrightsPage = () => {
  const [copyrights, setCopyrights] = useState<Copyright[]>([]);
  const [selectedCopyright, setSelectedCopyright] = useState<Copyright | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchCopyrights();
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

  const fetchCopyrights = async () => {
    try {
      const response = await fetch("/api/ipr-professional/types/copyrights");
      if (!response.ok) {
        throw new Error("Failed to fetch copyrights");
      }
      const data = await response.json();
      setCopyrights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch copyrights");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: "Accepted" | "Rejected") => {
    if (!selectedCopyright || !contract) return;

    setIsSubmitting(true);
    setTransactionInProgress(true);

    try {
      // First update the status in database
      const response = await fetch(
        `/api/ipr-professional/${selectedCopyright._id}`,
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
        throw new Error("Failed to update copyright status");
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
          `/api/ipr-professional/${selectedCopyright._id}/transactionHash`,
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
          description: `Copyright ${status.toLowerCase()} successfully. Transaction confirmed!`,
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

      await fetchCopyrights();
      setSelectedCopyright(null);
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

  const getStatusColor = (status: Copyright["status"]) => {
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Copyright Applications</h1>

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
          {copyrights.map((copyright) => (
            <TableRow key={copyright._id}>
              <TableCell>{copyright.title}</TableCell>
              <TableCell>
                {copyright.ownerType === "Startup"
                  ? copyright.owner.startupName
                  : copyright.owner.name}
              </TableCell>
              <TableCell>{format(new Date(copyright.filingDate), "PP")}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(copyright.status)}
                >
                  {copyright.status}
                </Badge>
              </TableCell>
              <TableCell>
                {copyright.status === "Pending" ? (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCopyright(copyright)}
                  >
                    Review
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedCopyright(copyright)}
                  >
                    View
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Copyright Review Dialog */}
      <Dialog
        open={!!selectedCopyright}
        onOpenChange={() => setSelectedCopyright(null)}
      >
        <DialogContent className="max-w-2xl">
          {isWalletConnected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCopyright?.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-600">{selectedCopyright?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Owner</h3>
                    <p className="text-gray-600">
                      {selectedCopyright?.ownerType === "Startup"
                        ? selectedCopyright.owner.startupName
                        : selectedCopyright?.owner.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedCopyright?.owner.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Filing Date</h3>
                    <p className="text-gray-600">
                      {selectedCopyright &&
                        format(new Date(selectedCopyright.filingDate), "PP")}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Related Documents</h3>
                  <div className="mt-2">
                    {selectedCopyright?.relatedDocuments.map((doc, index) => (
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

                {selectedCopyright?.status === "Pending" ? (
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
                    {selectedCopyright?.transactionHash && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Transaction Hash</h3>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${selectedCopyright.transactionHash}#eventlog`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline break-all"
                        >
                          {selectedCopyright.transactionHash}
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
                  Please connect your MetaMask wallet to review copyright
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

export default CopyrightsPage;
