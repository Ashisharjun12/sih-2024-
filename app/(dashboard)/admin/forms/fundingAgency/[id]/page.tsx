"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Loader2, XCircle, CheckCircle } from "lucide-react";

interface FormSubmission {
  _id: string;
  userId: string;
  formType: string;
  formData: {
    owner: {
      fullName: string;
      email: string;
      phone: string;
      businessAddress: {
        physicalAddress: string;
      };
      note: string;
    };
    agencyDetails: {
      name: string;
      registrationNumber: string;
      type: string;
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
      note?: string;
    }>;
    fundingPreferences: {
      investmentRange: {
        minimum: string;
        maximum: string;
      };
      preferredStages: string[];
      fundingTypes: string[];
      preferredSectors: string[];
      disbursementMode: string;
    };
    experience: {
      yearsOfOperation: string;
      totalInvestments: string;
      averageTicketSize: string;
      successfulExits: string;
    };
    documents: {
      registrationCertificate?: {
        public_id: string;
        secure_url: string;
      };
      governmentApprovals?: {
        public_id: string;
        secure_url: string;
      };
      addressProof?: {
        public_id: string;
        secure_url: string;
      };
      taxDocuments?: {
        public_id: string;
        secure_url: string;
      };
      portfolioDocument?: {
        public_id: string;
        secure_url: string;
      };
    };
  };
  status: "pending" | "approved" | "rejected";
  userEmail: string;
  userName: string;
  submittedAt: string;
}

export default function FundingAgencyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        console.log("Fetching form details for ID:", params.id);
        
        const response = await fetch(`/api/admin/forms/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch form details");
        }
        
        const data = await response.json();
        console.log("Fetched Form Data:", data);
        
        setFormData(data.submission);
      } catch (error) {
        console.error("Error fetching form details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch form details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchFormDetails();
    }
  }, [params.id, toast]);

  const handleAction = async (action: "approve" | "reject") => {
    try {
      setProcessing(true);

      const userEmail = formData?.formData.owner.email;
      
      const response = await fetch(
        `/api/admin/forms/fundingAgency/${params.id}/${action}`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            reason: action === "reject" ? "Your application does not meet our current requirements. Please try again." : undefined,
            userEmail,
            formType: formData?.formType,
            userName: formData?.formData.owner.fullName
          }),
        }
      );

      const data = await response.json();
      console.log("Action response:", data);
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} application`);
      }

      toast({
        title: "Success",
        description: `Application ${action}ed successfully`,
      });

      router.push("/admin/forms");
    } catch (error) {
      console.error("Action error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} application`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading form details...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No form data found</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Agency Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Agency Name</h3>
                <p>{formData.formData.agencyDetails.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Registration Number</h3>
                <p>{formData.formData.agencyDetails.registrationNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold">Type</h3>
                <p>{formData.formData.agencyDetails.type.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <h3 className="font-semibold">Establishment Date</h3>
                <p>{format(new Date(formData.formData.agencyDetails.establishmentDate), "PP")}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{formData.formData.agencyDetails.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Official Email</h3>
                <p>{formData.formData.contactInformation.officialEmail}</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone Number</h3>
                <p>{formData.formData.contactInformation.phoneNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold">Website</h3>
                <p>{formData.formData.contactInformation.websiteURL}</p>
              </div>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>{formData.formData.contactInformation.officialAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Representatives */}
        <Card>
          <CardHeader>
            <CardTitle>Representatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.formData.representatives.map((rep, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Name</h3>
                      <p>{rep.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Designation</h3>
                      <p>{rep.designation}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>{rep.email}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p>{rep.phone}</p>
                    </div>
                  </div>
                  {rep.note && (
                    <p className="mt-2 text-sm text-muted-foreground">{rep.note}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funding Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Funding Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Investment Range</h3>
                <p>₹{formData.formData.fundingPreferences.investmentRange.minimum} - 
                   ₹{formData.formData.fundingPreferences.investmentRange.maximum}</p>
              </div>
              <div>
                <h3 className="font-semibold">Preferred Stages</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.formData.fundingPreferences.preferredStages.map((stage, index) => (
                    <Badge key={index} variant="secondary">
                      {stage.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Funding Types</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.formData.fundingPreferences.fundingTypes.map((type, index) => (
                    <Badge key={index} variant="secondary">
                      {type.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Preferred Sectors</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.formData.fundingPreferences.preferredSectors.map((sector, index) => (
                    <Badge key={index} variant="secondary">
                      {sector.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Disbursement Mode</h3>
                <p>{formData.formData.fundingPreferences.disbursementMode.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(formData.formData.documents).map(([key, doc]) => (
                doc && (
                  <div key={key}>
                    <h3 className="font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    <a
                      href={doc.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Status */}
        <Card>
          <CardHeader>
            <CardTitle>Form Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Status</h3>
                <Badge variant={
                  formData.status === "approved" ? "default" :
                  formData.status === "rejected" ? "destructive" :
                  "secondary"
                } className={
                  formData.status === "approved" ? "bg-green-500" :
                  formData.status === "rejected" ? "bg-red-500" :
                  "bg-yellow-500"
                }>
                  {formData.status.toUpperCase()}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">Submitted At</h3>
                <p>{format(new Date(formData.submittedAt), "PPpp")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {formData?.status === "pending" && (
          <motion.div 
            className="flex justify-end gap-4 sticky bottom-6 p-4 rounded-xl border backdrop-blur-sm bg-background/95 shadow-lg"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAction("reject")}
              disabled={processing}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              {processing ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-5 w-5 mr-2" />
              )}
              Reject Application
            </Button>
            <Button
              size="lg"
              onClick={() => handleAction("approve")}
              disabled={processing}
              className="bg-primary hover:bg-primary/90"
            >
              {processing ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5 mr-2" />
              )}
              Approve Application
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}