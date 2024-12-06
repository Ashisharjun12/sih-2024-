"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Search,
  Calendar,
  Clock,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  CalendarPlus,
  CheckCircle2,
  XCircle,
  Target,
  Rocket,
  Microscope,
  Video,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MenteeDetails {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  details: {
    startupDetails?: {
      startupName: string;
      startupLogo?: {
        secure_url: string;
      };
      stage: string;
      industries: string[];
      about: string;
    };
    owner?: {
      name: string;
      designation: string;
    };
    businessActivities?: {
      missionAndVision: string;
    };
  } | null;
  meetings: Array<{
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    meetLink?: string;
  }>;
}

export default function MenteesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [mentees, setMentees] = useState<MenteeDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'startup' | 'researcher'>('all');

  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = async () => {
    try {
      const response = await fetch('/api/mentor/mentees');
      const data = await response.json();
      if (data.success) {
        setMentees(data.mentees);
      }
    } catch (error) {
      console.error('Error fetching mentees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentee details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMeeting = async (meetingId: string) => {
    try {
      const response = await fetch(`/api/mentor/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approved',
          meetLink: generateMeetLink() // You can implement this function to generate meet links
        }),
      });

      if (!response.ok) throw new Error('Failed to accept meeting');

      toast({
        title: "Success",
        description: "Meeting request accepted",
      });

      // Refresh meetings list
      fetchMentees();
    } catch (error) {
      console.error('Error accepting meeting:', error);
      toast({
        title: "Error",
        description: "Failed to accept meeting request",
        variant: "destructive",
      });
    }
  };

  const handleRejectMeeting = async (meetingId: string) => {
    try {
      const response = await fetch(`/api/mentor/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'rejected'
        }),
      });

      if (!response.ok) throw new Error('Failed to reject meeting');

      toast({
        title: "Success",
        description: "Meeting request rejected",
      });

      // Refresh meetings list
      fetchMentees();
    } catch (error) {
      console.error('Error rejecting meeting:', error);
      toast({
        title: "Error",
        description: "Failed to reject meeting request",
        variant: "destructive",
      });
    }
  };

  // Helper function to generate meet link
  const generateMeetLink = () => {
    // You can implement your own logic to generate meet links
    return `https://meet.google.com/${Math.random().toString(36).substring(7)}`;
  };

  const handleStartChat = (userId: string) => {
    router.push(`/mentor/messages?userId=${userId}`);
  };

  const filteredMentees = mentees.filter(mentee => {
    const matchesSearch = mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentee.details?.startupDetails?.startupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeFilter === 'all' || mentee.role.toLowerCase() === activeFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'startup':
        return { icon: Rocket, color: 'text-blue-500' };
      case 'researcher':
        return { icon: Microscope, color: 'text-green-500' };
      default:
        return { icon: Users, color: 'text-gray-500' };
    }
  };

  return (
    <div className="container max-w-7xl py-6 space-y-6 px-4 md:px-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-4 md:p-6">
        <div className="relative space-y-2">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl md:text-3xl font-bold">My Mentees</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            View and manage your mentees
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4"
        >
          <Users className="h-5 w-5 text-blue-500 mb-2" />
          <p className="text-xl font-bold">{mentees.length}</p>
          <p className="text-xs text-blue-600/70">Total Mentees</p>
        </motion.div>
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-4">
          <Calendar className="h-5 w-5 text-emerald-500 mb-2" />
          <p className="text-xl font-bold">
            {mentees.reduce((total, mentee) => total + mentee.meetings.length, 0)}
          </p>
          <p className="text-xs text-emerald-600/70">Total Sessions</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mentees..."
            className="pl-9 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter('all')}
            className={cn(
              "rounded-full",
              activeFilter === 'all' && "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
            )}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter('startup')}
            className={cn(
              "rounded-full",
              activeFilter === 'startup' && "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
            )}
          >
            <Rocket className="h-4 w-4 mr-1" />
            Startups
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter('researcher')}
            className={cn(
              "rounded-full",
              activeFilter === 'researcher' && "bg-green-500/10 text-green-600 hover:bg-green-500/20"
            )}
          >
            <Microscope className="h-4 w-4 mr-1" />
            Researchers
          </Button>
        </div>
      </div>

      {/* Mentees List */}
      <div className="grid gap-3">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredMentees.length > 0 ? (
          filteredMentees.map((mentee) => (
            <motion.div
              key={mentee._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-muted/5 rounded-xl overflow-hidden">
                {/* Mentee Header */}
                <div className="p-4 md:p-6 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-transparent">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={mentee.image} />
                        <AvatarFallback>
                          {mentee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium flex flex-wrap items-center gap-2">
                          {mentee.name}
                          <Badge 
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              getRoleIcon(mentee.role).color
                            )}
                          >
                            {mentee.role}
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">{mentee.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartChat(mentee._id)}
                      className="md:self-start"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>

                {/* Mentee Details */}
                {mentee.details && (
                  <div className="p-4 md:p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {mentee.role === 'startup' && mentee.details.startupDetails && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Startup Name</Label>
                            <p className="font-medium">{mentee.details.startupDetails.startupName}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Stage</Label>
                            <p>{mentee.details.startupDetails.stage}</p>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs text-muted-foreground">Industries</Label>
                            <div className="flex flex-wrap gap-2">
                              {mentee.details.startupDetails.industries.map((industry, i) => (
                                <Badge 
                                  key={i} 
                                  variant="secondary"
                                  className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                                >
                                  {industry}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      {mentee.details.businessActivities?.missionAndVision && (
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-xs text-muted-foreground">Mission & Vision</Label>
                          <p className="text-sm text-muted-foreground">
                            {mentee.details.businessActivities.missionAndVision}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Meetings */}
                <div className="p-4 md:p-6 bg-muted/5">
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Scheduled Meetings
                  </h4>
                  <div className="space-y-3">
                    {mentee.meetings.map(meeting => (
                      <div 
                        key={meeting._id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-start md:items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{meeting.topic}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {new Date(meeting.date).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {meeting.startTime} - {meeting.endTime}
                              </p>
                            </div>
                          </div>
                        </div>
                        {meeting.meetLink && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                            className="md:self-center"
                          >
                            <a 
                              href={meeting.meetLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <Video className="h-4 w-4" />
                              Join Meeting
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                    {mentee.meetings.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No meetings scheduled
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No mentees found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "Try adjusting your search" : "You don't have any mentees yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
