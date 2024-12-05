"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, Phone, MapPin, Building2, Edit,
  Save, Rocket, Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StartupProfile {
  _id: string;
  owner: {
    fullName: string;
    email: string;
    phone: string;
    businessAddress: {
      city: string;
      state: string;
    };
  };
  startupCount?: number;
}

export default function StartupProfile() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StartupProfile | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  useEffect(() => {
    if (profile) {
      console.log(profile)
      setEditedProfile(profile);
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/startup/profile");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      setProfile(data.profile);
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

  const handleInputChange = (section: string, field: string, value: string | number) => {
    setEditedProfile((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/startup/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData: editedProfile }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
        <div className="container max-w-5xl px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Avatar className="h-24 w-24 ring-4 ring-white/50">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-white/10 text-2xl">
                  {profile?.owner.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold mt-4">{profile?.owner.fullName}</h1>
              <p className="text-blue-100">Startup Founder</p>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Rocket className="h-6 w-6 mx-auto mb-2 text-blue-100" />
                <p className="text-2xl font-bold">{profile?.startupCount || 0}</p>
                <p className="text-sm text-blue-100">Startups</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-100" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-blue-100">Team Members</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Building2 className="h-6 w-6 mx-auto mb-2 text-blue-100" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-blue-100">Active Projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container max-w-5xl px-4 -mt-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-500 hover:text-blue-600"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Email</p>
              </div>
              {isEditing ? (
                <Input
                  value={editedProfile?.owner.email || ""}
                  onChange={(e) => handleInputChange("owner", "email", e.target.value)}
                  className="bg-white/50"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">{profile?.owner.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-500 rounded-lg">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">Phone</p>
              </div>
              {isEditing ? (
                <Input
                  value={editedProfile?.owner.phone || ""}
                  onChange={(e) => handleInputChange("owner", "phone", e.target.value)}
                  className="bg-white/50"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">{profile?.owner.phone}</p>
              )}
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Location</p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {profile?.owner.businessAddress.city}, {profile?.owner.businessAddress.state}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 