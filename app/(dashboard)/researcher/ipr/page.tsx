"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, ExternalLink, FileText } from "lucide-react";
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
      const response = await fetch("/api/researcher/ipr");
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
        return "bg-orange-500";
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
        <Button className="bg-orange-400" asChild>
          <Link href="/researcher/ipr/create">
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
              className="cursor-pointer hover:bg-orange-100"
              onClick={() => {
                setSelectedIPR(ipr);
                console.log(ipr);
              }}
            >
              <TableCell>{ipr.ipr.title}</TableCell>
              <TableCell>{ipr.ipr.type}</TableCell>
              <TableCell>
                {format(new Date(ipr.ipr.filingDate), "PP")}
              </TableCell>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl">
          {/* Header Section */}
          <div className="sticky top-0 bg-white border-b border-orange-100 pb-4 mb-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-orange-700">
                {selectedIPR?.ipr.title}
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-6 px-2">
            {/* Description Section */}
            <div className="bg-orange-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Description</h3>
              <p className="text-orange-700">{selectedIPR?.ipr.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-5">
                <h3 className="font-semibold text-orange-800 mb-2">Type</h3>
                <p className="text-orange-700">{selectedIPR?.ipr.type}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-5">
                <h3 className="font-semibold text-orange-800 mb-2">Filing Date</h3>
                <p className="text-orange-700">
                  {selectedIPR && format(new Date(selectedIPR.ipr.filingDate), "PP")}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-5">
                <h3 className="font-semibold text-orange-800 mb-2">Status</h3>
                <Badge
                  variant="secondary"
                  className={`${selectedIPR ? getStatusColor(selectedIPR.ipr.status) : ''}`}
                >
                  {selectedIPR?.ipr.status}
                </Badge>
              </div>
              <div className="bg-orange-50 rounded-lg p-5">
                <h3 className="font-semibold text-orange-800 mb-2">Transaction Hash</h3>
                <Link
                  href={`https://sepolia.etherscan.io/tx/${selectedIPR?.ipr.transactionHash}#eventlog`}
                  className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-2"
                  target="_blank"
                >
                  {selectedIPR?.ipr.transactionHash.slice(0, 10)}...
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* IPR Professional Section */}
            {selectedIPR?.iprProfessional && (
              <div className="bg-orange-50 rounded-lg p-5">
                <h3 className="font-semibold text-orange-800 mb-2">IPR Professional</h3>
                <div className="space-y-2">
                  <p className="text-orange-700">
                    {selectedIPR.iprProfessional.name} ({selectedIPR.iprProfessional.email})
                  </p>
                  {selectedIPR.message && (
                    <p className="text-orange-700">Message: {selectedIPR.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="bg-orange-50 rounded-lg p-5">
              <h3 className="font-semibold text-orange-800 mb-4">Status Timeline</h3>
              <div className="relative flex justify-between items-center">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-orange-200 -translate-y-1/2" />
                {['Pending', 'Basic Details', 'Document verified', 'Accepted', 'Rejected']
                  .filter((status) => {
                    if (selectedIPR?.ipr.status === 'Accepted') return status !== 'Rejected';
                    if (selectedIPR?.ipr.status === 'Rejected') return status !== 'Accepted';
                    return true;
                  })
                  .map((status, index) => (
                    <div key={status} className="relative z-10 flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${selectedIPR?.ipr.status === status 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-orange-100 text-orange-500'}`}
                      >
                        <div className="w-2 h-2 rounded-full bg-current" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-orange-800 whitespace-nowrap">
                        {status}
                      </p>
                      {selectedIPR?.ipr.status === status && (
                        <span className="text-xs text-orange-500 mt-1">Current</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Related Documents */}
            <div className="bg-orange-50 rounded-lg p-5">
              <h3 className="font-semibold text-orange-800 mb-2">Related Documents</h3>
              <div className="space-y-2">
                {selectedIPR?.ipr.relatedDocuments.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors p-2 rounded-lg hover:bg-orange-100"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Document {index + 1}</span>
                    <ExternalLink className="h-4 w-4 ml-auto" />
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
