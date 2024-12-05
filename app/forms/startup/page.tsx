"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { industries, sectors, stages } from "@/lib/constants";

interface FileUpload {
  public_id: string;
  secure_url: string;
}

interface FormData {
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
    dateOfBirth: string;
    gender: string;
    identityProof: {
      type: string;
      number: string;
    };
  };
  startupDetails: {
    startupName: string;
    industry: string;
    stage: string;
    businessModel: string;
    revenueModel: string;
    founders: Array<{ name: string; role: string; contactDetails: string }>;
    directors: Array<{ name: string; role: string; contactDetails: string }>;
    equitySplits: Array<{ ownerName: string; equityPercentage: number }>;
    gstNumber: string;
    panNumber: string;
    cinNumber: string;
    msmeRegistration: string;
  };
  businessActivities: {
    missionAndVision: string;
  };
}

const StartupRegistrationForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    owner: {
      fullName: "",
      email: "",
      phone: "",
      businessAddress: {
        physicalAddress: "",
        city: "",
        state: "",
        pincode: "",
      },
      dateOfBirth: "",
      gender: "Male",
      identityProof: {
        type: "Aadhar",
        number: "",
      },
    },
    startupDetails: {
      startupName: "",
      industry: "",
      stage: "Ideation",
      businessModel: "B2B",
      revenueModel: "Subscription",
      founders: [{ name: "", role: "", contactDetails: "" }],
      directors: [{ name: "", role: "", contactDetails: "" }],
      equitySplits: [{ ownerName: "", equityPercentage: 0 }],
      gstNumber: "",
      panNumber: "",
      cinNumber: "",
      msmeRegistration: "",
    },
    businessActivities: {
      missionAndVision: "",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forms/startup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Success!",
        description: "Your startup registration form has been submitted successfully.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Startup Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.owner.fullName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.owner.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.owner.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="physicalAddress">Business Address</Label>
              <Input
                id="physicalAddress"
                name="physicalAddress"
                value={formData.owner.businessAddress.physicalAddress}
                onChange={handleInputChange}
                required
                placeholder="Enter physical address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.owner.businessAddress.city}
                onChange={handleInputChange}
                required
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.owner.businessAddress.state}
                onChange={handleInputChange}
                required
                placeholder="Enter state"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.owner.businessAddress.pincode}
                onChange={handleInputChange}
                required
                placeholder="Enter pincode"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.owner.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(value) => handleInputChange({ target: { name: "gender", value } })}
                value={formData.owner.gender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startupName">Startup Name</Label>
                  <Input
                    id="startupName"
                    name="startupName"
                    value={formData.startupDetails.startupName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your startup name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    onValueChange={(value) => handleInputChange({ target: { name: "industry", value } })}
                    value={formData.startupDetails.industry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select
                    onValueChange={(value) => handleInputChange({ target: { name: "stage", value } })}
                    value={formData.startupDetails.stage}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

            <div className="space-y-2">
                  <Label htmlFor="businessModel">Business Model</Label>
              <Select
                    onValueChange={(value) => handleInputChange({ target: { name: "businessModel", value } })}
                    value={formData.startupDetails.businessModel}
              >
                <SelectTrigger>
                      <SelectValue placeholder="Select business model" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="B2B">Business to Business</SelectItem>
                      <SelectItem value="B2C">Business to Consumer</SelectItem>
                      <SelectItem value="B2B2C">Business to Business to Consumer</SelectItem>
                      <SelectItem value="D2C">Direct to Consumer</SelectItem>
                </SelectContent>
              </Select>
            </div>

                <div className="space-y-2">
                  <Label htmlFor="revenueModel">Revenue Model</Label>
                  <Select
                    onValueChange={(value) => handleInputChange({ target: { name: "revenueModel", value } })}
                    value={formData.startupDetails.revenueModel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue model" />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueModelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex justify-between">
              {currentStep === 1 && (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              )}
              {currentStep === 2 && (
                <>
                  <Button type="button" onClick={prevStep}>
                    Previous
              </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Submit
              </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupRegistrationForm; 