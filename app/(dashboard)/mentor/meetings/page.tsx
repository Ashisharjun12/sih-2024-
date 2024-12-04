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
  X
} from "lucide-react";
import { getNextMeetLink } from "@/lib/meet-links";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

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

  const fetchMeetings = async () => {
    try {
      const res = await fetch('/api/mentor/meetings');
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings);
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
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold">Meetings</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[200px]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* User Type Filter */}
            <Select value={userTypeFilter} onValueChange={(value: any) => setUserTypeFilter(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="startup">Startups</SelectItem>
                <SelectItem value="researcher">Researchers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{meetings.filter(m => m.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{meetings.filter(m => m.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{meetings.filter(m => m.status === 'rejected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 overflow-hidden">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <CardTitle>Mentoring Rate Settings</CardTitle>
            </div>
            {!isEditingRate && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditingRate(true)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Adjust Rate
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {isEditingRate ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Set Your Hourly Rate</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="pl-9"
                      placeholder="Enter amount"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set your hourly rate for mentoring sessions. This amount will be charged to mentees per session.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => updateHourlyRate(hourlyRate)}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Save Rate
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setIsEditingRate(false)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Rate</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">₹{hourlyRate}</span>
                      <span className="text-sm text-muted-foreground">/hour</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Monthly Earnings</p>
                    <p className="text-2xl font-semibold text-green-600">
                      ₹{(hourlyRate * 20).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Based on 20 sessions</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Session Duration</p>
                    <p className="text-2xl font-semibold">60 mins</p>
                    <p className="text-xs text-muted-foreground">Standard duration</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meetings List */}
      <div className="grid gap-4">
        {sortedMeetings.map((meeting) => (
          <Card key={meeting._id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
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
                <Badge 
                  variant={
                    meeting.status === 'approved' 
                      ? 'default'
                      : meeting.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {meeting.status}
                </Badge>
              </div>

              {meeting.status === 'pending' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter Google Meet link (optional - auto-generated if empty)"
                      value={meetLinks[meeting._id] || ''}
                      onChange={(e) => setMeetLinks(prev => ({
                        ...prev,
                        [meeting._id]: e.target.value
                      }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMeetingAction(meeting._id, 'approved')}
                      className="flex-1"
                      variant="outline"
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleMeetingAction(meeting._id, 'rejected')}
                      className="flex-1"
                      variant="outline"
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      Reject
                    </Button>
                  </div>
                </div>
              ) : meeting.status === 'approved' && meeting.meetLink ? (
                <Button
                  variant="link"
                  className="mt-4"
                  asChild
                >
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Join Meeting
                  </a>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}

        {sortedMeetings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No meetings found
          </div>
        )}
      </div>
    </div>
  );
}
