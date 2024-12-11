"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Calendar,
  Target,
  Briefcase,
  Shield,
  FileText,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquareText,
  MessageSquare,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Startup from "@/models/startup.model";

interface StartupDetails {
  _id: string;
  userId: string;
  owner: {
    fullName: string;
    email: string;
    phone: string;
    businessAddress: {
      physicalAddress: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  startupDetails: {
    startupLogo?: {
      secure_url: string;
    };
    startupName: string;
    about: string;
    industries: string[];
    sectors: string[];
    stage: string;
    registrationNumber: string;
    incorporationDate: string;
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
  };
  businessActivities: {
    missionAndVision: string;
  };
  legalAndCompliance: {
    gstin: string;
    licenses: Array<{
      type: string;
      number: string;
      validUntil: string;
    }>;
  };
  isActivelyFundraising: boolean;
  additionalInfo: {
    website?: string;
    socialMedia?: {
      linkedIn?: string;
      twitter?: string;
      facebook?: string;
    };
    pitchDeck?: {
      secure_url: string;
    };
    incorporationCertificate?: {
      secure_url: string;
    };
  };
}

export default function StartupDetails({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const { data: session } = useSession();
  const [startup, setStartup] = useState<StartupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const [isSending, setIsSending] = useState(false);
  const [amount, setAmount] = useState("");
  const [fundingType, setFundingType] = useState("");
  const [message, setMessage] = useState("");
  const [selectedstartups, setselectedstartups] = useState("");
  const [allstartups,setallstartups ]=useState([])
  
  interface FundingType {
    value: string;
    label: string;
  }
  const fundingTypes: FundingType[] = [
    { value: "Private_Equity", label: "Private Equity" },
    { value: "Equity_Funding", label: "Equity Funding" },
    { value: "Debt_Funding", label: "Debt Funding" },
    { value: "Grants", label: "Grants " },
    { value: "Convertible_Notes", label: "Convertible_Notes" },
    { value: "Revenue_Based_Financing", label: "Revenue_Based_Financing" },
    { value: "Scholarship", label: "Convertible Note" }
  
  
    
  ];
  const { toast } = useToast();

 const fetchallstartup= async ()=>{
  const response = await fetch(`/api/startup/each`);

  const data = await response.json();
  console.log("allthe statups ,,________________0",data.startups)

  setallstartups(data.startups)



 }

 useEffect(()=>{
  fetchallstartup()
 },[allstartups])


 console


  useEffect(() => {
    const fetchStartupDetails = async () => {
      try {
        const response = await fetch(`/api/startup/projects/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch startup details");
        }
        const data = await response.json();
        console.log("Startup data received:", data);
        setStartup(data.startup);
      } catch (err) {
        console.error("Error fetching startup:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch startup details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStartupDetails();
    }
  }, [session, params.projectid]);

  const [selectedStartupDetails, setSelectedStartupDetails] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleformsubmit = async () => {
    try {
      setIsSending(true);
      const selectedFundingType = fundingTypes.find(t => t.value === fundingType);
      
      // Validate required fields
      if (!amount || !fundingType || !message || !selectedstartups) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for API
      const requestData = {
        startupId: params.id,
        amount: Number(amount),
        fundingType: fundingType,
        message: message
      };

      // Send request to API
      const response = await fetch('/api/funding-agency/fundings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send funding request');
      }

      // Show success message
      toast({
        title: "Success",
        description: "Funding request sent successfully",
      });

      // Log the successful submission
      console.log("Funding Request Submitted:", {
        "Startup Being Viewed": {
          id: params.id,
          name: startup?.startupDetails.startupName,
        },
        "Funding Details": {
          amount: Number(amount),
          type: selectedFundingType?.label,
          message: message,
        },
        "Submission Time": new Date().toLocaleString(),
      });

      // Reset form
      setAmount("");
      setFundingType("");
      setMessage("");
      setselectedstartups("");

    } catch (error) {
      console.error("Error submitting funding request:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send funding request",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleStartupSelection = (startupId: string) => {
    setselectedstartups(startupId);
    const selectedStartup = allstartups.find((s: any) => s._id === startupId);
    if (selectedStartup) {
      setSelectedStartupDetails({
        id: startupId,
        name: selectedStartup.startupDetails?.startupName || '',
      });
    }
  };

  const handleSendRequest = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(
        `/api/funding-agency/requests/${params.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) throw new Error("Failed to send request");

      toast({
        title: "Success",
        description: "Request sent successfully",
      });
      setMessage("");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send request",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error || "Startup not found"}</p>
      </div>
    );
  }

  const isFundingAgency = session?.user?.role === "fundingAgency";

  return (
    <div className="container py-4 space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-8">
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Basic Info */}
          <div>
            <div className="flex items-center gap-6 mb-6">
              {startup?.startupDetails.startupLogo ? (
                <Image
                  width={80}
                  height={80}
                  src={startup.startupDetails.startupLogo.secure_url}
                  alt={startup.startupDetails.startupName}
                  className="h-20 w-20 object-contain rounded-xl bg-background p-2"
                />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-background p-2 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-blue-500/70" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">
                  {startup?.startupDetails.startupName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {startup?.owner.fullName}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    {startup?.startupDetails.stage}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    {startup?.startupDetails.businessModel}
                  </Badge>
                  {startup?.isActivelyFundraising && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500 text-emerald-500 px-3 py-1"
                    >
                      Actively Fundraising
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats and Metrics Button */}
          <div className="space-y-4 min-w-[240px]">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-xl text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">
                  {startup?.startupDetails.founders.length}
                </p>
                <p className="text-sm text-muted-foreground">Founders</p>
              </div>
              <div className="bg-background/50 p-4 rounded-xl text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">
                  {format(
                    new Date(startup?.startupDetails.incorporationDate || ""),
                    "yyyy"
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Founded</p>
              </div>
            </div>

            {/* New Metrics Button */}
            <div className="flex flex-row gap-2">
              {(session?.user?.role === "fundingAgency" ||
                session?.user?.role === "startup" ||
                session?.user?.role === "researcher" ||
                session?.user?.role === "mentor") && (
                <Button
                  className="bg-white grid place-items-center hover:bg-white"
                  onClick={() =>
                    router.push(`/startup/messages/${startup.userId}`)
                  }
                >
                  <MessageSquareText className="h-6 w-6 text-blue-500 grid place-items-center" />
                </Button>
              )}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600"
                onClick={() =>
                  router.push(
                    `/explore/startupDetails/${startup?._id}/startupsmatrics`
                  )
                }
              >
                <Target className="mr-2 h-4 w-4" />
                View Startup Metrics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{startup?.owner.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Phone className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{startup?.owner.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">
                  {startup?.owner.businessAddress.physicalAddress}
                  <br />
                  {startup?.owner.businessAddress.city},{" "}
                  {startup?.owner.businessAddress.state}
                  <br />
                  {startup?.owner.businessAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-gradient-to-br from-teal-500/5 via-emerald-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-teal-500" />
            Business Details
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Industries</p>
              <div className="flex flex-wrap gap-2">
                {startup?.startupDetails.industries.map((industry, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 px-3 py-1"
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Sectors</p>
              <div className="flex flex-wrap gap-2">
                {startup?.startupDetails.sectors.map((sector, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-3 py-1"
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <Target className="h-4 w-4 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Model</p>
                  <p className="font-medium mt-1">
                    {startup?.startupDetails.revenueModel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-500" />
            Legal Information
          </h2>
          <div className="space-y-4">
            <div className="bg-background/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Registration Number
              </p>
              <p className="font-medium mt-1">
                {startup?.startupDetails.registrationNumber}
              </p>
            </div>
            <div className="bg-background/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">GSTIN</p>
              <p className="font-medium mt-1">
                {startup?.legalAndCompliance.gstin}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Licenses</p>
              <div className="grid gap-3">
                {startup?.legalAndCompliance.licenses.map((license, index) => (
                  <div
                    key={index}
                    className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-violet-500/10 rounded-lg">
                        <Shield className="h-4 w-4 text-violet-500" />
                      </div>
                      <p className="font-medium">{license.type}</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Number: {license.number}</p>
                      <p>
                        Valid until:{" "}
                        {format(new Date(license.validUntil), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Information */}
        <div className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Team Information
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Founders</p>
              <div className="grid gap-3">
                {startup?.startupDetails.founders.map((founder, index) => (
                  <div
                    key={index}
                    className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Users className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">{founder.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {founder.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Phone className="h-4 w-4" />
                      <p>{founder.contactDetails}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Equity Distribution
              </p>
              <div className="grid gap-3">
                {startup?.startupDetails.equitySplits.map((split, index) => (
                  <div
                    key={index}
                    className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Target className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="font-medium">{split.ownerName}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                      >
                        {split.equityPercentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents & Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents */}
        <div className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Documents
          </h2>
          <div className="grid gap-4">
            {startup?.additionalInfo.pitchDeck && (
              <a
                href={startup.additionalInfo.pitchDeck.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Pitch Deck</p>
                  <p className="text-sm text-muted-foreground">View Document</p>
                </div>
              </a>
            )}

            {startup?.additionalInfo.incorporationCertificate && (
              <a
                href={
                  startup.additionalInfo.incorporationCertificate.secure_url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
              >
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Incorporation Certificate</p>
                  <p className="text-sm text-muted-foreground">View Document</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Online Presence */}
        <div className="bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-500" />
            Online Presence
          </h2>
          <div className="grid gap-4">
            {startup?.additionalInfo.website && (
              <a
                href={
                  startup.additionalInfo.website.startsWith("http")
                    ? startup.additionalInfo.website
                    : `https://${startup.additionalInfo.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
              >
                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20">
                  <Globe className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">
                    {startup.additionalInfo.website}
                  </p>
                </div>
              </a>
            )}

            {startup?.additionalInfo.socialMedia && (
              <div className="grid gap-3">
                {startup.additionalInfo.socialMedia.linkedIn && (
                  <a
                    href={
                      startup.additionalInfo.socialMedia.linkedIn.startsWith(
                        "http"
                      )
                        ? startup.additionalInfo.socialMedia.linkedIn
                        : `https://${startup.additionalInfo.socialMedia.linkedIn}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
                  >
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
                      <Linkedin className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">
                        View Profile
                      </p>
                    </div>
                  </a>
                )}

                {startup.additionalInfo.socialMedia.twitter && (
                  <a
                    href={
                      startup.additionalInfo.socialMedia.twitter.startsWith(
                        "http"
                      )
                        ? startup.additionalInfo.socialMedia.twitter
                        : `https://${startup.additionalInfo.socialMedia.twitter}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
                  >
                    <div className="p-2 bg-sky-500/10 rounded-lg group-hover:bg-sky-500/20">
                      <Twitter className="h-5 w-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-muted-foreground">
                        View Profile
                      </p>
                    </div>
                  </a>
                )}

                {startup.additionalInfo.socialMedia.facebook && (
                  <a
                    href={
                      startup.additionalInfo.socialMedia.facebook.startsWith(
                        "http"
                      )
                        ? startup.additionalInfo.socialMedia.facebook
                        : `https://${startup.additionalInfo.socialMedia.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
                  >
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20">
                      <Facebook className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-sm text-muted-foreground">
                        View Profile
                      </p>
                    </div>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Funding Request Button for Funding Agencies */}
      {isFundingAgency && (
         <Dialog>
       <DialogTrigger asChild>
            <Button className="fixed bottom-8 right-8 shadow-lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Funding Request
            </Button>
          </DialogTrigger>
         <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
           <DialogHeader>
             <DialogTitle>Add New Funding</DialogTitle>
             <DialogDescription>
               Enter the funding details below
             </DialogDescription>
           </DialogHeader>
           <div className="flex-1 overflow-y-auto">
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Amount (₹)</label>
                 <Input
                   type="number"
                   placeholder="Enter amount"
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Funding Type</label>
                 <Select value={fundingType} onValueChange={setFundingType}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select funding type" />
                   </SelectTrigger>
                   <SelectContent>
                     {fundingTypes.map((type) => (
                       <SelectItem key={type.value} value={type.value}>
                         {type.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Message</label>
                 <Textarea
                   placeholder="Enter additional details about the funding"
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   className="min-h-[100px]"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Select startups </label>
                 <RadioGroup 
                   value={selectedstartups} 
                   onValueChange={handleStartupSelection}
                 >
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[200px] overflow-y-auto rounded-lg border p-4">
                     {allstartups.map((startup: any) => (
                       <Label
                         key={startup._id}
                         className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                           selectedstartups === startup._id ? "border-primary bg-accent" : ""
                         }`}
                         htmlFor={startup._id}
                       >
                         <RadioGroupItem value={startup._id} id={startup._id} />
                         <div className="flex items-center space-x-3">
                           <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10 flex-shrink-0">
                             {startup.logo ? (
                               <Image
                                 src={startup.logo.secure_url}
                                 alt={startup.agencyName}
                                 fill
                                 className="object-cover"
                               />
                             ) : (
                               <Building2 className="h-6 w-6 m-2 text-primary" />
                             )}
                           </div>
                           <div className="min-w-0">
                             <p className="font-medium truncate">{startup.startupDetails?.startupName}</p>
                             <p className="text-sm text-muted-foreground truncate">ID: {startup._id}</p>
                             </div>
                         </div>
                       </Label>
                     ))}
                   </div>
                 </RadioGroup>
                 <div className="pt-4 border-t">
                      <Button 
                        className="w-full" 
                        onClick={handleformsubmit}
                        disabled={isSending || !amount || !fundingType || !message || !selectedstartups}
                      >
                       {isSending ? (
                         <>
                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                           Sending Request...
                         </>
                       ) : (
                         <>
                           <Plus className="h-4 w-4 mr-2" />
                           Send Funding Request
                         </>
                       )}
                      </Button>
                    </div>
               </div>
             </div>
           </div>
           <div className="pt-4 border-t">
             {/* <Button 
               className="w-full" 
               onClick={handleSubmitFunding}
               disabled={isSubmitting || !amount || !fundingType || !message || !selectedstartups}
             >
               {isSubmitting ? "Submitting..." : "Add Funding"}
             </Button> */}
           </div>
         </DialogContent>
       </Dialog>
      )}
    </div>
  );
}
