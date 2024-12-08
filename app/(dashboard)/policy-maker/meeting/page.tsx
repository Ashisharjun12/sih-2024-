"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  CheckCircle2,
  Building2,
  Microscope,
  Rocket,
  UserCog,
  Banknote,
  GraduationCap,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Update the meeting type to remove status
interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  location?: string;
  link?: string;
  description: string;
  attendees: string[];
}

// Update the hardcoded meetings data
const upcomingMeetings: Meeting[] = [
  {
    id: 1,
    title: "Policy Implementation Discussion",
    date: "2024-02-15",
    time: "10:00 AM",
    type: "Virtual",
    attendees: ["Startups", "Researchers"],
    description: "Discussion about new innovation policies and implementation strategies.",
    link: "meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    title: "Funding Guidelines Workshop",
    date: "2024-02-18",
    time: "2:30 PM",
    type: "Hybrid",
    attendees: ["Funding Agencies", "Startups"],
    description: "Workshop on new funding guidelines and application process.",
    location: "GIFT City, Gujarat",
  },
  {
    id: 3,
    title: "Research Collaboration Meet",
    date: "2024-02-20",
    time: "11:00 AM",
    type: "Physical",
    attendees: ["Researchers", "Industry Experts"],
    description: "Meeting to discuss research collaboration opportunities.",
    location: "Science City, Ahmedabad",
  },
];

const stakeholders = [
  {
    title: "Startups",
    icon: Rocket,
    count: 150,
    description: "Active startups in ecosystem",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Researchers",
    icon: Microscope,
    count: 75,
    description: "Research institutions",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Funding Agencies",
    icon: Banknote,
    count: 30,
    description: "Investment partners",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Mentors",
    icon: UserCog,
    count: 45,
    description: "Industry experts",
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Educational Institutes",
    icon: GraduationCap,
    count: 25,
    description: "Partner institutions",
    color: "bg-pink-100 text-pink-700",
  },
  {
    title: "Industry Partners",
    icon: Building2,
    count: 60,
    description: "Corporate collaborators",
    color: "bg-indigo-100 text-indigo-700",
  },
];

export default function MeetingPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(upcomingMeetings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Omit<Meeting, 'id'>>({
    title: "",
    date: "",
    time: "",
    type: "",
    location: "",
    link: "",
    description: "",
    attendees: [],
  });
  const { toast } = useToast();

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time || !newMeeting.type) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const meeting: Meeting = {
      id: meetings.length + 1,
      ...newMeeting,
    };

    setMeetings([meeting, ...meetings]);
    setIsDialogOpen(false);
    setNewMeeting({
      title: "",
      date: "",
      time: "",
      type: "",
      location: "",
      link: "",
      description: "",
      attendees: [],
    });

    toast({
      title: "Success",
      description: "Meeting scheduled successfully",
    });
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Policy Meetings Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect and collaborate with stakeholders
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  placeholder="Enter meeting title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Meeting Type</Label>
                <Select
                  value={newMeeting.type}
                  onValueChange={(value) => setNewMeeting({ ...newMeeting, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meeting type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                    <SelectItem value="Physical">Physical</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newMeeting.type === "Virtual" ? (
                <div className="grid gap-2">
                  <Label htmlFor="link">Meeting Link</Label>
                  <Input
                    id="link"
                    placeholder="Enter meeting link"
                    value={newMeeting.link}
                    onChange={(e) => setNewMeeting({ ...newMeeting, link: e.target.value })}
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter meeting location"
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter meeting description"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attendees">Attendees</Label>
                <Select
                  value={newMeeting.attendees.join(",")}
                  onValueChange={(value) => 
                    setNewMeeting({ 
                      ...newMeeting, 
                      attendees: value.split(",").filter(Boolean)
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select attendees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Startups,Researchers">Startups & Researchers</SelectItem>
                    <SelectItem value="Funding Agencies,Startups">Funding Agencies & Startups</SelectItem>
                    <SelectItem value="Researchers,Industry Experts">Researchers & Industry Experts</SelectItem>
                    <SelectItem value="Mentors,Startups">Mentors & Startups</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMeeting}>
                Schedule Meeting
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Meetings Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group p-4 rounded-xl border bg-card hover:shadow-lg hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-start mb-3">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {meeting.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {meeting.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {meeting.type === "Virtual" ? (
                            <Video className="h-4 w-4 text-primary" />
                          ) : (
                            <MapPin className="h-4 w-4 text-primary" />
                          )}
                          <span>{meeting.type === "Virtual" ? meeting.link : meeting.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{meeting.attendees.join(", ")}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold text-primary">24</div>
                  <div className="text-xs text-muted-foreground">Total Meetings</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold text-primary">18</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Stakeholder Access */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Stakeholder Ecosystem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stakeholders.map((stakeholder, index) => (
                  <motion.button
                    key={stakeholder.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl ${stakeholder.color} hover:opacity-90 transition-all text-left group`}
                  >
                    <stakeholder.icon className="h-6 w-6 mb-2" />
                    <div className="font-semibold mb-1">{stakeholder.title}</div>
                    <div className="text-2xl font-bold mb-1">{stakeholder.count}</div>
                    <div className="text-xs opacity-80">{stakeholder.description}</div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
