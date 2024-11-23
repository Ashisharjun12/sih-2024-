"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
import { format } from "date-fns";
import { IPR } from "@/types/ipr";
import Link from "next/link";

interface IPRWithProfessional extends IPR {
  iprProfessional?: {
    name: string;
    email: string;
  };
  message?: string;
}

const IPRPage = () => {
  const [iprs, setIprs] = useState<IPRWithProfessional[]>([]);
  const [selectedIPR, setSelectedIPR] = useState<IPRWithProfessional | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIPRs();
    
  }, []);

  const fetchIPRs = async () => {
    try {
      const response = await fetch("/api/startup/ipr");
      if (!response.ok) {
        throw new Error("Failed to fetch IPRs");
      }
      const data = await response.json();
      console.log("data", data);
      setIprs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch IPRs");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: IPR["status"]) => {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Intellectual Property Rights</h1>
        <Button asChild>
          <Link href="/startup/ipr/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            File New IPR
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Filing Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {iprs.map((ipr) => (
            <TableRow
              key={ipr.ipr._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedIPR(ipr)}
            >
              <TableCell>{ipr.ipr.title}</TableCell>
              <TableCell>{ipr.ipr.type}</TableCell>
              <TableCell>{format(new Date(ipr.ipr.filingDate), "PP")}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(ipr.ipr.status)}
                >
                  {ipr.ipr.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* IPR Details Dialog */}
      <Dialog open={!!selectedIPR} onOpenChange={() => setSelectedIPR(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedIPR?.ipr.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600">{selectedIPR?.ipr.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Type</h3>
                <p className="text-gray-600">{selectedIPR?.ipr.type}</p>
              </div>
              <div>
                <h3 className="font-semibold">Filing Date</h3>
                <p className="text-gray-600">
                  {selectedIPR &&
                    format(new Date(selectedIPR.ipr.filingDate), "PP")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <Badge
                  variant="secondary"
                  className={
                    selectedIPR ? getStatusColor(selectedIPR.ipr.status) : undefined
                  }
                >
                  {selectedIPR?.ipr.status}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">Transaction Hash</h3>
                <p className="text-gray-600 truncate">
                  {selectedIPR?.ipr.transactionHash}
                </p>
              </div>
            </div>
            {selectedIPR?.iprProfessional && (
              <div>
                <h3 className="font-semibold">IPR Professional</h3>
                <p className="text-gray-600">
                  {selectedIPR.iprProfessional.name} (
                  {selectedIPR.iprProfessional.email})
                </p>
                {selectedIPR.message && (
                  <p className="text-gray-600 mt-2">
                    Message: {selectedIPR.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <h3 className="font-semibold">Related Documents</h3>
              <div className="mt-2">
                {selectedIPR?.ipr.relatedDocuments.map((doc, index) => (
                  <a
                    key={index}
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IPRPage;
