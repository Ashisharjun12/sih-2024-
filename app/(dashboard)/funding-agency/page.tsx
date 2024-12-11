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
import { motion } from "framer-motion";
import {
  Building2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Plus,
} from "lucide-react";
import { FundingAgencyCard } from "@/components/cards/funding-agency-card";

interface WalletData {
  balance: number;
  transactions: Array<{
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    createdAt: string;
  }>;
}

interface FundingAgency {
  _id: string;
  userId: string;
  personalInfo: {
    name: string;
    email: {
      address: string;
      verified: boolean;
    };
    phone: {
      number: string;
      verified: boolean;
    };
    uniqueId: {
      type: string;
      number: string;
    };
  };
  agencyInfo: {
    agencyName: string;
    registrationNumber: string;
    type: string;
    establishmentYear: number;
    location: string;
    employeeCount: number;
    website?: string;
  };
  documents: {
    profilePicture?: {
      public_id: string;
      secure_url: string;
    };
  };
  fundingHistory?: Array<{
    startupId: string;
    amount: number;
    date: string;
  }>;
}

export default function FundingAgencyDashboard() {
  const { toast } = useToast();
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    transactions: []
  });
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agencies, setAgencies] = useState<FundingAgency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
    fetchAgencies();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await fetch('/api/wallet/balance');
      const data = await res.json();
      if (data.success) {
        setWalletData({
          balance: data.balance,
          transactions: data.transactions
        });
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const fetchAgencies = async () => {
    try {
      const res = await fetch('/api/funding-agency/all');
      const data = await res.json();
      if (data.success) {
        setAgencies(data.agencies);
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch funding agencies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) })
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: `Added ₹${amount} to your wallet`,
        });
        setAmount("");
        setShowAddMoneyModal(false);
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
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Wallet Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">Your Wallet</h2>
          </div>
          <Button
            onClick={() => setShowAddMoneyModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Money
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-3xl font-bold">₹{walletData.balance.toLocaleString('en-IN')}</p>
          </div>

          {/* Recent Transactions */}
          {walletData.transactions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
              <div className="space-y-2">
                {walletData.transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {transaction.type === 'credit' ? (
                        <ArrowUpRight className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      transaction.type === 'credit' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add Money Modal */}
      <Dialog open={showAddMoneyModal} onOpenChange={setShowAddMoneyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleAddMoney}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add Money'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Funding Agencies Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : agencies.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {agencies.map((agency) => (
            <FundingAgencyCard key={agency._id} agency={agency} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Funding Agencies</h3>
          <p className="text-sm text-muted-foreground">
            No funding agencies are available at the moment
          </p>
        </div>
      )}
    </div>
  );
}
