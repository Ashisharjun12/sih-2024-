"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  CreditCard,
  Calendar,
  Shield,
  Loader2,
  Edit,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const businessModelOptions = [
  { value: "B2B", label: "Business to Business" },
  { value: "B2C", label: "Business to Consumer" },
  { value: "B2B2C", label: "Business to Business to Consumer" },
  { value: "D2C", label: "Direct to Consumer" },
];

const revenueModelOptions = [
  { value: "Subscription", label: "Subscription Based" },
  { value: "SaaS", label: "Software as a Service" },
  { value: "Product_Sales", label: "Product Sales" },
  { value: "Service_Based", label: "Service Based" },
  { value: "Marketplace", label: "Marketplace" },
  { value: "Advertising", label: "Advertising" },
  { value: "Freemium", label: "Freemium" },
  { value: "Licensing", label: "Licensing" },
  { value: "Commission_Based", label: "Commission Based" },
];

export default function StartupProfile() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  useEffect(() => {
    if (profile) {
      setUpdatedProfile(profile);
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/startup/profile");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      setProfile(data.profile.formData);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("/api/startup/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData: updatedProfile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfile(updatedProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (section: string, field: string, value: string | number) => {
    setUpdatedProfile((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (section: string, parentField: string, field: string, value: string) => {
    setUpdatedProfile((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [field]: value,
        },
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Profile Found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Your startup profile information is not available. This might be because your application is still pending or hasn't been approved yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold">Startup Profile</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your startup profile information
            </p>
          </div>
          <Button
            variant="outline"
            onClick={isEditing ? handleUpdate : handleEdit}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </motion.div>

        {/* Profile Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-8"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {profile.owner.fullName?.charAt(0) || "S"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{profile.owner.fullName}</h2>
                  <p className="text-muted-foreground">{profile.startupDetails.startupName}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  {isEditing ? (
                    <Input
                      value={updatedProfile?.owner?.fullName || ""}
                      onChange={(e) => handleInputChange("owner", "fullName", e.target.value)}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {profile.owner.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {profile.owner.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Phone</label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={updatedProfile?.owner?.phone || ""}
                      onChange={(e) => handleInputChange("owner", "phone", e.target.value)}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {profile.owner.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Date of Birth</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={updatedProfile?.owner?.dateOfBirth || ""}
                      onChange={(e) => handleInputChange("owner", "dateOfBirth", e.target.value)}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(profile.owner.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Gender</label>
                  {isEditing ? (
                    <Select
                      value={updatedProfile?.owner?.gender || ""}
                      onValueChange={(value) => handleInputChange("owner", "gender", value)}
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
                  ) : (
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {profile.owner.gender}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Industry</label>
                  {isEditing ? (
                    <Input
                      value={updatedProfile?.startupDetails?.industry || ""}
                      onChange={(e) => handleInputChange("startupDetails", "industry", e.target.value)}
                    />
                  ) : (
                    <p>{profile.startupDetails.industry}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Stage</label>
                  {isEditing ? (
                    <Select
                      value={updatedProfile?.startupDetails?.stage || ""}
                      onValueChange={(value) => handleInputChange("startupDetails", "stage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ideation">Ideation</SelectItem>
                        <SelectItem value="Validation">Validation</SelectItem>
                        <SelectItem value="EarlyTraction">Early Traction</SelectItem>
                        <SelectItem value="Scaling">Scaling</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>{profile.startupDetails.stage}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Business Model</label>
                  {isEditing ? (
                    <Select
                      value={updatedProfile?.startupDetails?.businessModel || ""}
                      onValueChange={(value) => handleInputChange("startupDetails", "businessModel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business model" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessModelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>{profile.startupDetails.businessModel}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Revenue Model</label>
                  {isEditing ? (
                    <Select
                      value={updatedProfile?.startupDetails?.revenueModel || ""}
                      onValueChange={(value) => handleInputChange("startupDetails", "revenueModel", value)}
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
                  ) : (
                    <p>{profile.startupDetails.revenueModel}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Incorporation Date</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={updatedProfile?.startupDetails?.incorporationDate?.split('T')[0] || ""}
                      onChange={(e) => handleInputChange("startupDetails", "incorporationDate", e.target.value)}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(profile.startupDetails.incorporationDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">GST Number</label>
                  {isEditing ? (
                    <Input
                      value={updatedProfile?.startupDetails?.gstNumber || ""}
                      onChange={(e) => handleInputChange("startupDetails", "gstNumber", e.target.value)}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {profile.startupDetails.gstNumber || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">PAN Number</label>
                  {isEditing ? (
                    <Input
                      value={updatedProfile?.startupDetails?.panNumber || ""}
                      onChange={(e) => handleInputChange("startupDetails", "panNumber", e.target.value)}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {profile.startupDetails.panNumber || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">CIN Number</label>
                  {isEditing ? (
                    <Input
                      value={updatedProfile?.startupDetails?.cinNumber || ""}
                      onChange={(e) => handleInputChange("startupDetails", "cinNumber", e.target.value)}
                      placeholder="Enter CIN number"
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {profile.startupDetails.cinNumber || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">MSME Registration</label>
                  {isEditing ? (
                    <Input
                      value={updatedProfile?.startupDetails?.msmeRegistration || ""}
                      onChange={(e) => handleInputChange("startupDetails", "msmeRegistration", e.target.value)}
                      placeholder="Enter MSME registration number"
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {profile.startupDetails.msmeRegistration || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Business Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {["physicalAddress", "city", "state", "pincode"].map((field) => (
                  <div key={field} className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {isEditing ? (
                      <Input
                        value={updatedProfile?.owner?.businessAddress?.[field] || ""}
                        onChange={(e) => handleNestedInputChange("owner", "businessAddress", field, e.target.value)}
                      />
                    ) : (
                      <p>{profile.owner.businessAddress[field]}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Update Profile Button - Only show when editing */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end gap-4"
            >
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setUpdatedProfile(profile);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Profile
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 