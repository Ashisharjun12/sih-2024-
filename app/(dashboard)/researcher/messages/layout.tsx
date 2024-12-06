
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageSquare,
  User,
  Users as UsersIcon,
  Beaker as BeakerIcon,
  Building2 as Building2Icon,
  Rocket,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/available');
      const data = await res.json();
      if (data.success) {
        setAvailableUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    return availableUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'mentor':
        return {
          icon: UsersIcon,
          color: 'text-purple-500',
          label: 'Mentor'
        };
      case 'researcher':
        return {
          icon: BeakerIcon,
          color: 'text-green-500',
          label: 'Researcher'
        };
      case 'startup':
        return {
          icon: Rocket,
          color: 'text-blue-500',
          label: 'Startup'
        };
      default:
        return {
          icon: User,
          color: 'text-gray-500',
          label: role
        };
    }
  };

  const handleUserSelect = (userId: string) => {
    setShowChat(true);
    router.push(`/researcher/messages/${userId}`);
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full bg-background overflow-hidden md:border md:rounded-lg">
        <div className="grid grid-cols-12 h-full">
          {/* Users List */}
          <div 
            className={cn(
              "col-span-12 md:col-span-4 md:border-r",
              showChat ? "hidden md:block" : "block"
            )}
          >
            <div className="p-4 bg-muted/30 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-9 bg-background"
                />
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="divide-y divide-muted/50">
                {getFilteredUsers().map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      onClick={() => handleUserSelect(user._id)}
                      className={cn(
                        "w-full p-4 text-left transition-colors hover:bg-muted/50",
                        location.pathname.includes(user._id) && "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{user.name}</span>
                            <Badge 
                              variant="secondary" 
                              className={cn("text-xs", getRoleIcon(user.role).color)}
                            >
                              {getRoleIcon(user.role).label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div 
            className={cn(
              "col-span-12 md:col-span-8 flex flex-col h-full overflow-y-auto",
              !showChat ? "hidden md:flex" : "flex"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}