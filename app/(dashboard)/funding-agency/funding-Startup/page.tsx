"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Wallet,
  ArrowRight,
  IndianRupee,
  Rocket,
  Target,
  Users,
  CheckCircle2,
} from "lucide-react";

interface Startup {
  _id: string;
  userId: string;
  startupDetails: {
    startupName: string;
    startupLogo?: {
      secure_url: string;
    };
    about: string;
    industries: string[];
    stage: string;
  };
  businessActivities: {
    missionAndVision: string;
  };
  isActivelyFundraising: boolean;
}

export default function FundingStartupPage() {
  const { toast } = useToast();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [fundingAmount, setFundingAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    fetchStartups();
    fetchWalletBalance();
  }, []);

  const fetchStartups = async () => {
    try {
      const res = await fetch('/api/startup/all');
      const data = await res.json();
      if (data.success) {
        setStartups(data.startups.filter((s: Startup) => s.isActivelyFundraising));
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch startups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const res = await fetch('/api/wallet/balance');
      const data = await res.json();
      if (data.success) {
        setWalletBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleFund = async () => {
    if (!selectedStartup || !fundingAmount || !paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedStartup.userId,
          amount: Number(fundingAmount)
        })
      });

      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Successfully funded ${selectedStartup.startupDetails.startupName}`,
        });
        setShowFundingModal(false);
        resetForm();
      } else {
        throw new Error(data.error || "Failed to process funding");
      }
    } catch (error) {
      console.error('Funding error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process funding",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedStartup(null);
    setFundingAmount("");
    setPaymentMethod("");
    setMessage("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Fund Startups</h1>
              <p className="text-muted-foreground mt-2">
                Support innovative startups and help them grow
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg">
              <Wallet className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="font-semibold">₹{walletBalance.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Startups Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startups.map((startup) => (
          <Card key={startup._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {startup.startupDetails.startupName}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {startup.startupDetails.stage}
                    </Badge>
                  </div>
                  {startup.startupDetails.startupLogo && (
                    <img
                      src={startup.startupDetails.startupLogo.secure_url}
                      alt={startup.startupDetails.startupName}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {startup.startupDetails.about}
                </p>

                <div className="flex flex-wrap gap-2">
                  {startup.startupDetails.industries.map((industry, index) => (
                    <Badge key={index} variant="outline">
                      {industry}
                    </Badge>
                  ))}
                </div>

                <Button
                  className="w-full mt-2"
                  onClick={() => {
                    setSelectedStartup(startup);
                    setShowFundingModal(true);
                  }}
                >
                  Fund Startup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funding Modal */}
      <Dialog open={showFundingModal} onOpenChange={setShowFundingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Fund Startup</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {selectedStartup && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-medium">{selectedStartup.startupDetails.startupName}</h4>
                  <p className="text-sm text-muted-foreground">{selectedStartup.startupDetails.stage}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Funding Amount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wallet">Wallet Balance</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Message (Optional)</Label>
                <Textarea
                  placeholder="Add a message for the startup..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleFund}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Funding
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
