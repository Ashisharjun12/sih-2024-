import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const OfflinePage = () => {
  const meetings = [
    {
      id: 1,
      title: "Startup Pitch Day",
      date: "2024-02-15",
      time: "14:00-17:00",
      location: "Bangalore Tech Hub",
      address: "MG Road, Bangalore",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      attendees: 45,
      organizer: "TechStars India",
      status: "Upcoming",
      type: "Pitch Event",
      coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "Venture Capital Networking",
      date: "2024-02-20",
      time: "10:00-13:00",
      location: "Mumbai Innovation Center",
      address: "BKC, Mumbai",
      coordinates: { lat: 19.0760, lng: 72.8777 },
      attendees: 30,
      organizer: "Indian VC Association",
      status: "Open",
      type: "Networking",
      coverImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&auto=format&fit=crop&q=60"
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Hero Section with teal Gradient */}
      <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-teal-600 to-teal-400 p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Offline Meetings
          </h1>
          <p className="text-teal-50 text-lg max-w-2xl">
            Connect with investors and mentors in person. Discover upcoming events and networking opportunities near you.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100 L100 0 Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search events..." 
              className="pl-10 bg-white"
            />
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700">
            Create Meeting
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer bg-white hover:bg-teal-600 hover:text-white transition-colors">
            All Events
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-white hover:bg-teal-600 hover:text-white transition-colors">
            Pitch Days
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-white hover:bg-teal-600 hover:text-white transition-colors">
            Networking
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-white hover:bg-teal-600 hover:text-white transition-colors">
            Workshops
          </Badge>
        </div>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border-0 shadow-md">
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={meeting.coverImage} 
                alt={meeting.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge 
                  variant={meeting.status === "Upcoming" ? "default" : "secondary"}
                  className="bg-teal-600 text-white border-0"
                >
                  {meeting.status}
                </Badge>
                <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                  {meeting.type}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-gray-800">
                {meeting.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Meeting Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-teal-600" />
                  <span className="text-sm">{meeting.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <span className="text-sm">{meeting.time}</span>
                </div>
                <a 
                  href={`https://www.google.com/maps?q=${meeting.coordinates.lat},${meeting.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-gray-600 hover:text-teal-600 transition-colors group/map"
                >
                  <MapPin className="h-4 w-4 text-teal-600 mt-1" />
                  <div className="text-sm group-hover/map:text-teal-600">
                    <div className="font-medium">{meeting.location}</div>
                    <div className="text-xs text-gray-500 group-hover/map:text-teal-500">
                      {meeting.address}
                    </div>
                  </div>
                </a>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4 text-teal-600" />
                  <span className="text-sm">{meeting.attendees} Attendees</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4 text-teal-600" />
                  <span className="text-sm">{meeting.organizer}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                  Register
                </Button>
                <Button className="flex-1" variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {meetings.length === 0 && (
        <Card className="p-12 text-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <Calendar className="h-12 w-12 text-teal-600" />
            <h3 className="text-xl font-semibold text-gray-800">No Meetings Found</h3>
            <p className="text-gray-600">
              There are no offline meetings scheduled at the moment.
            </p>
            <Button className="bg-teal-600 hover:bg-teal-700">Create a Meeting</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OfflinePage;