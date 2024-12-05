"use client";

import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  User,
  Link as LinkIcon,
  Search,
  Filter,
  History,
  Beaker,
  Briefcase,
  IndianRupee,
  Pencil,
  Check,
  X,
  Users,
  CheckCircle2
} from "lucide-react";
import { getNextMeetLink } from "@/lib/meet-links";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";


interface Meeting {
  _id: string;
  userId: {
    name: string;
    email: string;
    role: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  meetLink?: string;
  userType: 'startup' | 'researcher';
}

export default function MentorMeetingsPage() {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [meetLinks, setMeetLinks] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'startup' | 'researcher'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [hourlyRate, setHourlyRate] = useState<number>(1000);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchMentorSettings = async () => {
    try {
      const res = await fetch('/api/mentor/settings');
      const data = await res.json();
      if (data.success) {
        setHourlyRate(data.mentor.hourlyRate);
      }
    } catch (error) {
      console.error('Error fetching mentor settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentor settings",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMeetings(),
          fetchMentorSettings()
        ]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const calculateTotalEarnings = (meetings: Meeting[]) => {
    return meetings
      .filter(meeting => meeting.status === 'approved')
      .reduce((total, meeting) => {
        // Calculate duration in hours
        const start = new Date(`2000/01/01 ${meeting.startTime}`);
        const end = new Date(`2000/01/01 ${meeting.endTime}`);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        
        // Calculate meeting cost based on hourly rate
        const meetingCost = durationHours * hourlyRate;
        return total + meetingCost;
      }, 0);
  };

  const fetchMeetings = async () => {
    try {
      const res = await fetch('/api/mentor/meetings');
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings);
        // Calculate and set total earnings whenever meetings are fetched
        const total = calculateTotalEarnings(data.meetings);
        setTotalEarnings(total);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch meetings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update total earnings whenever hourly rate changes
  useEffect(() => {
    const total = calculateTotalEarnings(meetings);
    setTotalEarnings(total);
  }, [hourlyRate, meetings]);

  const handleMeetingAction = async (meetingId: string, action: 'approved' | 'rejected') => {
    try {
      let meetLink = meetLinks[meetingId];
      
      if (action === 'approved') {
        meetLink = meetLink || getNextMeetLink();
      }

      console.log("Sending request:", {
        meetingId,
        action,
        meetLink
      });

      const response = await fetch(`/api/mentor/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          meetLink: action === 'approved' ? meetLink : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update meeting');
      }

      toast({
        title: "Success",
        description: `Meeting ${action} successfully`,
      });

      await fetchMeetings();
      setMeetLinks(prev => {
        const newLinks = { ...prev };
        delete newLinks[meetingId];
        return newLinks;
      });

    } catch (error) {
      console.error('Error updating meeting:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update meeting",
        variant: "destructive",
      });
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.userId.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = userTypeFilter === 'all' || meeting.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingMeetings = filteredMeetings.filter(m => m.status === 'pending');
  const approvedMeetings = filteredMeetings.filter(m => m.status === 'approved');
  const rejectedMeetings = filteredMeetings.filter(m => m.status === 'rejected');

  // Organize meetings by date (newest first)
  const sortedMeetings = filteredMeetings.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const updateHourlyRate = async (newRate: number) => {
    try {
      const response = await fetch('/api/mentor/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hourlyRate: newRate })
      });

      if (!response.ok) throw new Error('Failed to update rate');

      setHourlyRate(newRate);
      setIsEditingRate(false);
      toast({
        title: "Success",
        description: "Hourly rate updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hourly rate",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Upcoming Meetings</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your scheduled mentoring sessions and requests
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hourly Rate:</span>
              {isEditingRate ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-24 h-8"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateHourlyRate(hourlyRate)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">₹{hourlyRate}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingRate(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total Earnings:</span>
              <span className="font-semibold text-green-600">₹{totalEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pb-2">
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
          onClick={() => setActiveFilter('pending')}
          className={cn(
            "rounded-full",
            activeFilter === 'pending' && "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
          )}
        >
          Pending
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveFilter('approved')}
          className={cn(
            "rounded-full",
            activeFilter === 'approved' && "bg-green-500/10 text-green-600 hover:bg-green-500/20"
          )}
        >
          Approved
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveFilter('rejected')}
          className={cn(
            "rounded-full",
            activeFilter === 'rejected' && "bg-red-500/10 text-red-600 hover:bg-red-500/20"
          )}
        >
          Rejected
        </Button>
      </div>

      <div className="grid gap-4">
        {meetings.length > 0 ? (
          meetings
            .filter(meeting => activeFilter === 'all' || meeting.status === activeFilter)
            .map((meeting) => (
              <Card key={meeting._id} className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-medium">{meeting.userId.name}</h3>
                          <Badge variant={meeting.userType === 'startup' ? 'default' : 'secondary'}>
                            {meeting.userType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(meeting.date), 'PPP')} at {meeting.startTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {meeting.status === 'pending' ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleMeetingAction(meeting._id, 'approved')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleMeetingAction(meeting._id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge 
                          variant="secondary"
                          className={cn(
                            meeting.status === 'approved' && "bg-green-500/10 text-green-600",
                            meeting.status === 'rejected' && "bg-red-500/10 text-red-600"
                          )}
                        >
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{meeting.startTime} - {meeting.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">₹{hourlyRate}</span>
                      </div>
                    </div>
                    {meeting.meetLink && (
                      <div className="flex items-center gap-2 mt-2">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={meeting.meetLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {activeFilter === 'all' 
                ? 'No Meetings Available'
                : `No ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Meetings`}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {activeFilter === 'all'
                ? "You don't have any scheduled meetings at the moment."
                : `You don't have any ${activeFilter} meetings at the moment.`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
