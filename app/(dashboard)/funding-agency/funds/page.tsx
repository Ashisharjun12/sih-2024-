"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  Upload,
} from "lucide-react";
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
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await fetch("/api/funding-agency/timeline");
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

  const handleTimelineAction = async (action: "accept" | "reject") => {
    try {
      console.log(action)
      const response = await fetch(
        `/api/funding-agency/timeline/requests/${action}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `Timeline ${action}ed successfully`,
        });
        fetchTimeline();
      } else {
        throw new Error(`Failed to ${action} timeline`);
      }
    } catch (error) {
      console.error(`Error ${action}ing timeline:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} timeline`,
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/funding-agency/timeline/pay", {
        method: "POST",
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment processed successfully",
        });
        fetchTimeline();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  const handleContingencyForm = async (
    formId: string,
    action: "accept" | "reject"
  ) => {
    try {
      const response = await fetch(
        `/api/funding-agency/timeline/forms/${action}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: `Contingency form ${action}ed successfully`,
        });
        fetchTimeline();
      }
    } catch (error) {
      console.error("Error handling contingency form:", error);
      toast({
        title: "Error",
        description: `Failed to ${action} contingency form`,
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

  const timelineStages = timeline
    ? [
        {
          key: "preSeedFunding",
          label: "Pre-Seed Funding",
          data: timeline.preSeedFunding,
        },
        {
          key: "seedFunding",
          label: "Seed Funding",
          data: timeline.seedFunding,
        },
        { key: "seriesA", label: "Series A", data: timeline.seriesA },
        { key: "seriesB", label: "Series B", data: timeline.seriesB },
        { key: "seriesC", label: "Series C", data: timeline.seriesC },
        { key: "ipo", label: "IPO", data: timeline.ipo },
      ]
    : [];

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Funding Timeline</h1>
          <p className="text-muted-foreground">
            Manage funding stages and review contingency forms
          </p>
        </div>
        {timeline?.isAccepted === "pending" ? (
          <div className="flex flex-col gap-2">
            <div>Message : {timeline?.message}</div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => handleTimelineAction("accept")}
                className="bg-green-600 hover:bg-green-700"
              >
                Accept Timeline
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTimelineAction("reject")}
                className="text-red-600 hover:bg-red-50"
              >
                Reject Timeline
              </Button>
            </div>
          </div>
        ) : timeline?.isAccepted === "accepted" ? (
          <Button onClick={handlePayment}>Process Next Payment</Button>
        ) : null}
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />

        {/* Timeline Items */}
        <div className="space-y-12">
          {timelineStages.map((stage, index) => (
            <div
              key={stage.key}
              className={cn(
                "relative flex items-center",
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              )}
            >
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
                    .filter((form) => form.stageOfFunding === stage.key)
                    .map((form, formIndex) => (
                      <div
                        key={formIndex}
                        className="mt-4 p-3 bg-muted rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Contingency Request</p>
                            <p className="text-sm text-muted-foreground">
                              {form.description}
                            </p>
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
                        {form.isAccepted === "pending" && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleContingencyForm(
                                  formIndex.toString(),
                                  "accept"
                                )
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() =>
                                handleContingencyForm(
                                  formIndex.toString(),
                                  "reject"
                                )
                              }
                            >
                              Reject
                            </Button>
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
