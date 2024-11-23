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
import React from "react";

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
  const { toast } = useToast();

  useEffect(() => {
    fetchCopyrights();
  }, []);

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
    if (!selectedCopyright) return;

    setIsSubmitting(true);
    try {
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

      toast({
        title: "Success",
        description: `Copyright ${status.toLowerCase()} successfully`,
      });

      await fetchCopyrights();
      setSelectedCopyright(null);
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
                <Button
                  variant="outline"
                  onClick={() => setSelectedCopyright(copyright)}
                  disabled={copyright.status !== "Pending"}
                >
                  Review
                </Button>
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

export default CopyrightsPage;
