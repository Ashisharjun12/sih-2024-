"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, Globe, Mail, MapPin, Phone, Users, 
  FileText, CreditCard, TrendingUp 
} from "lucide-react";
import Image from "next/image";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface FundingAgencyDetails {
  userId: string;
  agencyDetails: {
    name: string;
    registrationNumber: string;
    type: 
      | 'Venture_Capital' 
      | 'Angel_Network' 
      | 'Crowdfunding_Platform' 
      | 'Government_Body' 
      | 'Financial_Institution' 
      | 'Corporate_Investor' 
      | 'NGO_Foundation';
    logo: {
      public_id: string;
      secure_url: string;
    };
    email: string;
    establishmentDate: string;
    description: string;
  };
  contactInformation: {
    officialAddress: string;
    officialEmail: string;
    phoneNumber: string;
    websiteURL: string;
  };
  representatives: Array<{
    name: string;
    designation: string;
    email: string;
    phone: string;
  }>;
  fundingPreferences: {
    minimumInvestment: number;
    preferredStages: string[];
    fundingTypes: string[];
    preferredSectors: string[];
    preferredIndustries: string[];
  };
  experience: {
    yearsOfOperation: number;
    totalInvestments: number;
    averageTicketSize?: number;
  };
}

export default function FundingAgencyPage({
  params,
}: {
  params: { id: string };
}) {
  const [fundingAgency, setFundingAgency] = useState<FundingAgencyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFundingForm, setShowFundingForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    message: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFundingAgencyDetails();
  }, []);

  const fetchFundingAgencyDetails = async () => {
    try {
      const response = await fetch(`/api/funding-agency/${params.id}`);
      const data = await response.json();
    
      if (data.agency) {
        setFundingAgency(data.agency);
      }
    } catch (error) {
      console.error("Error fetching funding agency details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch funding agency details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/startup/timeline/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formData.amount,
          fundingAgencyId: params.id,
          message: formData.message,
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Funding request submitted successfully",
        });
        setShowFundingForm(false);
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting funding request:", error);
      toast({
        title: "Error",
        description: "Failed to submit funding request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!fundingAgency) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Funding agency not found</p>
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden">
            <Image
              src={fundingAgency.agencyDetails.logo.secure_url}
              alt={fundingAgency.agencyDetails.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{fundingAgency.agencyDetails.name}</h1>
            <p className="text-muted-foreground">
              {fundingAgency.agencyDetails.type.replace(/_/g, ' ')}
            </p>
            <p className="text-sm text-muted-foreground">
              Established: {new Date(fundingAgency.agencyDetails.establishmentDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Dialog open={showFundingForm} onOpenChange={setShowFundingForm}>
          <DialogTrigger asChild>
            <Button size="lg">Request Funding</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Funding Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount (₹)</label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write a message to the funding agency"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">Submit Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" /> 
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <a 
                href={fundingAgency.contactInformation.websiteURL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                {fundingAgency.contactInformation.websiteURL}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <a 
                href={`mailto:${fundingAgency.contactInformation.officialEmail}`} 
                className="text-primary hover:underline"
              >
                {fundingAgency.contactInformation.officialEmail}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{fundingAgency.contactInformation.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{fundingAgency.contactInformation.officialAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>Representatives: {fundingAgency.representatives.length}</span>
            </div>
          </div>
        </Card>

        {/* Investment Preferences */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" /> 
            Investment Preferences
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Minimum Investment</p>
              <p className="font-medium">
                {formatAmount(fundingAgency.fundingPreferences.minimumInvestment)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Funding Types</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {fundingAgency.fundingPreferences.fundingTypes.map((type, index) => (
                  <span key={index} className="px-2 py-1 bg-secondary rounded-md text-sm">
                    {type.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Preferred Stages</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {fundingAgency.fundingPreferences.preferredStages.map((stage, index) => (
                  <span key={index} className="px-2 py-1 bg-secondary rounded-md text-sm">
                    {stage.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Experience */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" /> 
            Investment Experience
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Years of Operation</p>
              <p className="font-medium">{fundingAgency.experience.yearsOfOperation} years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Investments</p>
              <p className="font-medium">
                {formatAmount(fundingAgency.experience.totalInvestments)}
              </p>
            </div>
            {fundingAgency.experience.averageTicketSize && (
              <div>
                <p className="text-sm text-muted-foreground">Average Ticket Size</p>
                <p className="font-medium">
                  {formatAmount(fundingAgency.experience.averageTicketSize)}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}