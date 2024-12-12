"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { StartupCard } from "@/components/startup/startup-card";
import {
  Rocket,
  Users,
  Target,
  Building2,
  Plus,
  ChevronRight,
  Wallet2,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FundingAgencyCard } from "@/components/cards/funding-agency-card";
import { Chatbot } from "@/components/chatbot/chatbot";
import { StartupPopup } from "@/components/startup-popup";
import { cn } from "@/lib/utils";

interface WalletData {
  balance: number;
  transactions: Array<{
    type: "credit" | "debit";
    amount: number;
    description: string;
    createdAt: string;
  }>;
}

interface StartupData {
  _id: string;
  startupDetails: {
    startupName: string;
    startupLogo?: {
      secure_url: string;
    };
    about: string;
    industries: string[];
    sectors: string[];
    stage: string;
    businessModel: string;
    revenueModel: string;
    founders: Array<{
      name: string;
      role: string;
      contactDetails: string;
    }>;
    equitySplits: Array<{
      ownerName: string;
      equityPercentage: number;
    }>;
    iprFiled?: boolean;
  };
  businessActivities: {
    missionAndVision: string;
  };
  additionalInfo: {
    website?: string;
    socialMedia?: {
      linkedIn?: string;
      twitter?: string;
      facebook?: string;
    };
  };
  isActivelyFundraising: boolean;
}

interface StageProps {
  name: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  route?: string;
}

export default function StartupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    transactions: [],
  });
  const [recommendedFundingAgencies, setRecommendedFundingAgencies] = useState(
    []
  );

  const fetchFundingAgencies = async () => {
    try {
      const response = await fetch("/api/startup/recommendations");
      const data = await response.json();
      console.log("reco fundi",data);
      setRecommendedFundingAgencies(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStartups();
    fetchWalletData();
    fetchFundingAgencies();
  }, []);

  const fetchStartups = async () => {
    try {
      const res = await fetch("/api/startup/projects");
      const data = await res.json();
      if (data.startups) {
        setStartups(data.startups);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletData = async () => {
    try {
      const res = await fetch("/api/wallet/balance");
      const data = await res.json();
      if (data.success) {
        setWalletData({
          balance: data.balance,
          transactions: data.transactions,
        });
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const handleDeposit = async () => {
    if (
      !depositAmount ||
      isNaN(Number(depositAmount)) ||
      Number(depositAmount) <= 0
    ) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsDepositing(true);
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(depositAmount) }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: `Added ₹${depositAmount} to your wallet`,
        });
        setDepositAmount("");
        setShowDepositModal(false);
        fetchWalletData();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add money",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  // Function to determine current stage based on startup data
  const determineCurrentStage = (startups: StartupData[]) => {
    if (!startups.length) return 1; // Default to prototype stage
    
    const hasIpr = startups.some(startup => 
      startup.startupDetails?.iprFiled || false
    );
    
    if (hasIpr) return 2; // IPR Stage
    return 1; // Default to Prototype Stage
  };

  // Calculate current stage
  const currentStageIndex = determineCurrentStage(startups);

  const stages: StageProps[] = [
    {
      name: "Ideation",
      description: "Initial concept and business planning",
      isCompleted: true, // Always completed
      isActive: false,
    },
    {
      name: "Prototype",
      description: "Product development and testing",
      isCompleted: currentStageIndex > 1,
      isActive: currentStageIndex === 1,
    },
    {
      name: "IPR",
      description: "Intellectual property protection",
      isCompleted: currentStageIndex > 2,
      isActive: currentStageIndex === 2,
      route: "/startup/ipr"
    },
    {
      name: "Incubation",
      description: "Business growth and scaling",
      isCompleted: currentStageIndex > 3,
      isActive: currentStageIndex === 3,
      route: "/startup/funding"
    },
  ];

  // Handle stage click
  const handleStageClick = (stage: StageProps) => {
    if (stage.route) {
      router.push(stage.route);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Startup Journey</h2>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
            <div 
              className="absolute top-0 left-0 h-full bg-green-500" 
              style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }} 
            />
          </div>

          {/* Stages */}
          <div className="relative grid grid-cols-4 gap-4">
            {stages.map((stage, index) => (
              <div 
                key={stage.name} 
                className={cn(
                  "text-center",
                  stage.route && "cursor-pointer hover:opacity-80 transition-opacity"
                )}
                onClick={() => handleStageClick(stage)}
              >
                {/* Stage Icon */}
                <div className="flex justify-center mb-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      stage.isCompleted && "bg-green-100",
                      stage.isActive && "bg-blue-100",
                      !stage.isCompleted && !stage.isActive && "bg-gray-100",
                      stage.route && "hover:ring-2 hover:ring-offset-2 hover:ring-blue-500"
                    )}
                  >
                    {stage.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : stage.isActive ? (
                      <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Stage Name */}
                <h3 className={cn(
                  "font-medium",
                  stage.isCompleted && "text-green-600",
                  stage.isActive && "text-blue-600",
                  stage.route && "hover:underline"
                )}>
                  {stage.name}
                </h3>

                {/* Stage Description */}
                <p className="text-xs text-gray-500 mt-1">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StartupPopup />
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {session?.user?.name}! ✨
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Manage your startup ventures and track your progress.
          </p>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <Wallet2 className="h-6 w-6 text-green-500" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDepositModal(true)}
          >
            Add Money
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-2xl font-bold">
            ₹{walletData.balance.toLocaleString("en-IN")}
          </p>

          {/* Recent Transactions */}
          {walletData.transactions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Recent Activity
              </p>
              <div className="space-y-1">
                {walletData.transactions
                  .slice(0, 3)
                  .map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {transaction.type === "credit" ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-muted-foreground">
                          {transaction.description}
                        </span>
                      </div>
                      <span
                        className={
                          transaction.type === "credit"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {transaction.type === "credit" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Rocket className="h-6 w-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold">{startups.length}</p>
          <p className="text-sm text-green-600/70">Active Startups</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Users className="h-6 w-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-emerald-600/70">Team Members</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Target className="h-6 w-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold">89%</p>
          <p className="text-sm text-green-600/70">Goals Met</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Building2 className="h-6 w-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-green-600/70">Projects</p>
        </div>
      </div>

      {/* Recent Startups Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Recommended Funding Agencies
          </h2>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-6 pb-4">
            {recommendedFundingAgencies
              .slice(0, 3)
              .map((fundingAgency, index) => (
                <div key={fundingAgency._id} className="w-[400px] flex-none">
                  <FundingAgencyCard agency={fundingAgency} index={index} />
                </div>
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Fixed Mobile FAB */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          onClick={() => router.push("/startup/projects/create")}
          className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-500 
            flex items-center justify-center transition-all duration-200
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)]"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Add Money Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleDeposit}
              disabled={isDepositing}
            >
              {isDepositing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add Money"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Chatbot pageContext="startup" />
    </div>
  );
}
