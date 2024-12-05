"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, CalendarIcon, ExternalLink, Plus, PlusIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface IPRWithProfessional {
  ipr: {
    _id: string;
    title: string;
    description: string;
    type: string;
    status: "Pending" | "Accepted" | "Rejected";
    filingDate: string;
    transactionHash: string;
    relatedDocuments: Array<{
      public_id: string;
      secure_url: string;
    }>;
  };
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container py-4 px-2 md:px-6 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-4 md:p-8">
        <div className="relative flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Intellectual Property Rights</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              Manage and track your IPR applications
            </p>
          </div>
          {/* Desktop Create Button - Hide on Mobile */}
          <Button 
            asChild
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 
              hover:to-blue-600 text-white transition-all duration-300 hidden md:flex"
          >
            <Link href="/startup/ipr/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              File New IPR
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile View: IPR Cards */}
      <div className="md:hidden space-y-4">
        {iprs.map((ipr) => (
          <div
            key={ipr.ipr._id}
            onClick={() => setSelectedIPR(ipr)}
            className="bg-gradient-to-br from-background to-background/80 border rounded-xl p-4 
              cursor-pointer hover:bg-blue-50/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{ipr.ipr.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{ipr.ipr.type}</p>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "bg-opacity-10 transition-colors",
                  ipr.ipr.status === "Pending" && "bg-yellow-500 text-yellow-700",
                  ipr.ipr.status === "Accepted" && "bg-emerald-500 text-emerald-700",
                  ipr.ipr.status === "Rejected" && "bg-red-500 text-red-700"
                )}
              >
                {ipr.ipr.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              {format(new Date(ipr.ipr.filingDate), "PP")}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-gradient-to-br from-background to-background/80 border rounded-xl p-4 md:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Filing Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iprs.map((ipr) => (
                <TableRow
                  key={ipr.ipr._id}
                  className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                  onClick={() => setSelectedIPR(ipr)}
                >
                  <TableCell className="font-medium">{ipr.ipr.title}</TableCell>
                  <TableCell>{ipr.ipr.type}</TableCell>
                  <TableCell>{format(new Date(ipr.ipr.filingDate), "PP")}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "bg-opacity-10 transition-colors",
                        ipr.ipr.status === "Pending" && "bg-yellow-500 text-yellow-700",
                        ipr.ipr.status === "Accepted" && "bg-emerald-500 text-emerald-700",
                        ipr.ipr.status === "Rejected" && "bg-red-500 text-red-700"
                      )}
                    >
                      {ipr.ipr.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile: Bottom Sheet Dialog, Desktop: Regular Dialog */}
      {selectedIPR && (
        <>
          {/* Desktop Dialog */}
          <Dialog open={!!selectedIPR && window.innerWidth >= 768} onOpenChange={() => setSelectedIPR(null)}>
            <DialogContent className="max-w-2xl p-4 md:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl font-bold">
                  {selectedIPR?.ipr.title}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="text-sm">{selectedIPR?.ipr.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                    <p className="text-sm">{selectedIPR?.ipr.type}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Filing Date</h3>
                    <p className="text-sm">
                      {selectedIPR && format(new Date(selectedIPR.ipr.filingDate), "PP")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "bg-opacity-10",
                        selectedIPR?.ipr.status === "Pending" && "bg-yellow-500 text-yellow-700",
                        selectedIPR?.ipr.status === "Accepted" && "bg-emerald-500 text-emerald-700",
                        selectedIPR?.ipr.status === "Rejected" && "bg-red-500 text-red-700"
                      )}
                    >
                      {selectedIPR?.ipr.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Transaction Hash</h3>
                    <Link
                      href={`https://sepolia.etherscan.io/tx/${selectedIPR?.ipr.transactionHash}#eventlog`}
                      className="text-sm text-blue-600 hover:underline"
                      target="_blank"
                    >
                      {selectedIPR?.ipr.transactionHash.slice(0, 10)}...
                    </Link>
                  </div>
                </div>

                {selectedIPR?.iprProfessional && (
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-sm font-medium text-muted-foreground">IPR Professional</h3>
                    <div className="bg-blue-50/50 rounded-lg p-3 md:p-4">
                      <p className="text-sm font-medium">{selectedIPR.iprProfessional.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedIPR.iprProfessional.email}</p>
                      {selectedIPR.message && (
                        <p className="text-sm mt-2 pt-2 border-t">
                          Message: {selectedIPR.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground">Related Documents</h3>
                  <div className="grid gap-2">
                    {selectedIPR?.ipr.relatedDocuments.map((doc: { secure_url: string }, index: number) => (
                      <Link
                        key={index}
                        href={doc.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 
                          border border-blue-100/50 transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center 
                          group-hover:bg-blue-500/20 transition-colors">
                          <FileText className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium">Document {index + 1}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Mobile Sheet */}
          <Sheet open={!!selectedIPR && window.innerWidth < 768} onOpenChange={() => setSelectedIPR(null)}>
            <SheetContent side="bottom" className="h-[90vh] p-0">
              {/* Header with Sticky Background */}
              <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4">
                <SheetHeader>
                  <SheetTitle className="text-lg font-bold">
                    {selectedIPR.ipr.title}
                  </SheetTitle>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "w-fit bg-opacity-10 transition-colors",
                      selectedIPR.ipr.status === "Pending" && "bg-yellow-500 text-yellow-700",
                      selectedIPR.ipr.status === "Accepted" && "bg-emerald-500 text-emerald-700",
                      selectedIPR.ipr.status === "Rejected" && "bg-red-500 text-red-700"
                    )}
                  >
                    {selectedIPR.ipr.status}
                  </Badge>
                </SheetHeader>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 space-y-6 overflow-auto max-h-[calc(90vh-80px)]">
                {/* Description Section */}
                <div className="bg-gradient-to-br from-background to-background/80 rounded-xl border border-blue-100/50 p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm">{selectedIPR.ipr.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-background to-background/80 rounded-xl border border-blue-100/50 p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                    <p className="text-sm font-medium">{selectedIPR.ipr.type}</p>
                  </div>
                  <div className="bg-gradient-to-br from-background to-background/80 rounded-xl border border-blue-100/50 p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Filing Date</h3>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedIPR.ipr.filingDate), "PP")}
                    </p>
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className="bg-gradient-to-br from-background to-background/80 rounded-xl border border-blue-100/50 p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Transaction Hash</h3>
                  <Link
                    href={`https://sepolia.etherscan.io/tx/${selectedIPR.ipr.transactionHash}#eventlog`}
                    className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2"
                    target="_blank"
                  >
                    <span>{selectedIPR.ipr.transactionHash.slice(0, 10)}...</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

                {/* IPR Professional Info */}
                {selectedIPR.iprProfessional && (
                  <div className="bg-gradient-to-br from-background to-background/80 rounded-xl border border-blue-100/50 p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">IPR Professional</h3>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{selectedIPR.iprProfessional.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedIPR.iprProfessional.email}</p>
                      {selectedIPR.message && (
                        <p className="text-sm mt-3 pt-3 border-t">
                          {selectedIPR.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Related Documents</h3>
                  <div className="grid gap-2">
                    {selectedIPR.ipr.relatedDocuments.map((doc: { secure_url: string }, index: number) => (
                      <Link
                        key={index}
                        href={doc.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-background 
                          to-background/80 border border-blue-100/50 hover:bg-blue-50/50 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center 
                          group-hover:bg-blue-500/20 transition-colors">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium flex-1">Document {index + 1}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}

      {/* Mobile FAB - Show only on Mobile */}
      <div className="md:hidden">
        <Button
          asChild
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r 
            from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
        >
          <Link href="/startup/ipr/create">
            <PlusCircle className="h-6 w-6 text-white" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default IPRPage;
