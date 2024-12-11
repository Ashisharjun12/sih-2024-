"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, AlertCircle, CheckCircle2, Clock, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStage {
  name: string;
  amount: number;
  isActive: "completed" | "active" | "pending";
}

interface ContingencyForm {
  stageOfFunding: string;
  description: string;
  invoices: { public_id: string; secure_url: string }[];
  fundingAmount: number;
  isAccepted: "pending" | "accepted" | "rejected";
}

interface TimelineData {
  preSeedFunding: TimelineStage;
  seedFunding: TimelineStage;
  seriesA: TimelineStage;
  seriesB: TimelineStage;
  seriesC: TimelineStage;
  ipo: TimelineStage;
  contingencyForms: ContingencyForm[];
  isAccepted: "pending" | "accepted" | "rejected";
}

export default function FundsPage() {
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    fundingAmount: 0,
    invoices: [] as File[]
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await fetch("/api/startup/timeline");
      const data = await response.json();
      if (data.timeline) {
        setTimeline(data.timeline);
      }
    } catch (error) {
      console.error("Error fetching timeline:", error);
      toast({
        title: "Error",
        description: "Failed to fetch funding timeline",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStage) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("stageOfFunding", selectedStage);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("fundingAmount", formData.fundingAmount.toString());
      formData.invoices.forEach((file) => {
        formDataToSend.append("invoices", file);
      });

      const response = await fetch("/api/startup/timeline/form", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contingency form submitted successfully",
        });
        fetchTimeline();
        setSelectedStage(null);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit contingency form",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "active":
        return <Clock className="h-6 w-6 text-blue-500 animate-pulse" />;
      case "rejected":
        return <Ban className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-400" />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const timelineStages = timeline ? [
    { key: "preSeedFunding", label: "Pre-Seed Funding", data: timeline.preSeedFunding },
    { key: "seedFunding", label: "Seed Funding", data: timeline.seedFunding },
    { key: "seriesA", label: "Series A", data: timeline.seriesA },
    { key: "seriesB", label: "Series B", data: timeline.seriesB },
    { key: "seriesC", label: "Series C", data: timeline.seriesC },
    { key: "ipo", label: "IPO", data: timeline.ipo },
  ] : [];

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Funding Timeline</h1>
          <p className="text-muted-foreground">Track your funding stages and submit contingency forms</p>
        </div>
        {timeline?.isAccepted === "accepted" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Submit Contingency Form</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Contingency Form</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Stage of Funding</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedStage || ""}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    required
                  >
                    <option value="">Select Stage</option>
                    {timelineStages.map((stage) => (
                      <option key={stage.key} value={stage.key}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Funding Amount (₹)</label>
                  <Input
                    type="number"
                    value={formData.fundingAmount}
                    onChange={(e) => setFormData({ ...formData, fundingAmount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Invoices</label>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => setFormData({ ...formData, invoices: Array.from(e.target.files || []) })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Submit Form</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />

        {/* Timeline Items */}
        <div className="space-y-12">
          {timelineStages.map((stage, index) => (
            <div key={stage.key} className={cn(
              "relative flex items-center",
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            )}>
              {/* Content */}
              <div className="w-5/12">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{stage.label}</h3>
                      <p className="text-2xl font-bold text-primary">
                        {formatAmount(stage.data.amount)}
                      </p>
                    </div>
                    {getStatusIcon(stage.data.isActive)}
                  </div>

                  {/* Contingency Forms */}
                  {timeline?.contingencyForms
                    .filter(form => form.stageOfFunding === stage.key)
                    .map((form, formIndex) => (
                      <div key={formIndex} className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Contingency Request</p>
                            <p className="text-sm text-muted-foreground">{form.description}</p>
                            <p className="text-sm font-semibold mt-1">
                              Amount: {formatAmount(form.fundingAmount)}
                            </p>
                          </div>
                          {getStatusIcon(form.isAccepted)}
                        </div>
                        {form.invoices.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Invoices:</p>
                            <div className="flex gap-2 mt-1">
                              {form.invoices.map((invoice, i) => (
                                <a
                                  key={i}
                                  href={invoice.secure_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  <Upload className="h-4 w-4" />
                                  View
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </Card>
              </div>

              {/* Timeline Point */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
