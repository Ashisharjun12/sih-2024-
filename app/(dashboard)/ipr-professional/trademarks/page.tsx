"use client";

import { useEffect, useState } from "react";
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

const TrademarkPage = () => {
  const [trademarks, setTrademarks] = useState<Trademark[]>([]);
  const [selectedTrademark, setSelectedTrademark] = useState<Trademark | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrademarks();
  }, []);

  const fetchTrademarks = async () => {
    try {
      const response = await fetch("/api/ipr-professional/types/trademarks");
      if (!response.ok) {
        throw new Error("Failed to fetch trademarks");
      }
      const data = await response.json();
      setTrademarks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trademarks");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: "Accepted" | "Rejected") => {
    if (!selectedTrademark) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/ipr-professional/${selectedTrademark._id}`,
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

      toast({
        title: "Success",
        description: `Trademark ${status.toLowerCase()} successfully`,
      });

      await fetchTrademarks();
      setSelectedTrademark(null);
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trademark Applications</h1>

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
              <TableCell>{trademark.title}</TableCell>
              <TableCell>
                {trademark.ownerType === "Startup"
                  ? trademark.owner.startupName
                  : trademark.owner.name}
              </TableCell>
              <TableCell>{format(new Date(trademark.filingDate), "PP")}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(trademark.status)}
                >
                  {trademark.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTrademark(trademark)}
                  disabled={trademark.status !== "Pending"}
                >
                  Review
                </Button>
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
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600">{selectedTrademark?.description}</p>
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
                disabled={isSubmitting || !message}
              >
                Accept
              </Button>
              <Button
                onClick={() => handleStatusUpdate("Rejected")}
                className="flex-1 bg-red-500 hover:bg-red-600"
                disabled={isSubmitting || !message}
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrademarkPage;
