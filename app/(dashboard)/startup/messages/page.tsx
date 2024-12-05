"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Send,
  User,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  Smile,
  ArrowLeft,
  MessageSquare,
  Check,
  CheckCheck,
  Clock,
  Users as UsersIcon,
  Beaker as BeakerIcon,
  Building as Building2Icon,
  Rocket,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  image?: string;
  role: string;
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
  isRead?: boolean;
}

type UserRole = 'all' | 'mentor' | 'researcher' | 'fundingAgency' | 'startup';

export default function MessagesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isMobileUsersOpen, setIsMobileUsersOpen] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages();

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?receiverId=${selectedUser._id}&after=${lastMessageTimestamp}`);
        const data = await res.json();
        
        if (data.success && data.messages.length > 0) {
          setMessages(prevMessages => [...prevMessages, ...data.messages]);
          const latestMessage = data.messages[data.messages.length - 1];
          setLastMessageTimestamp(latestMessage.createdAt);
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [selectedUser, lastMessageTimestamp]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  const setupMessageStream = () => {
    if (!selectedUser || !session?.user) return;

    const chatId = generateChatId(session.user.id, selectedUser._id);
    const sse = new EventSource(`/api/messages/stream?chatId=${chatId}`);

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      }
    };

    sse.onerror = (error) => {
      console.error('SSE error:', error);
      sse.close();
    };

    setEventSource(sse);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/available');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
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

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/messages?receiverId=${selectedUser._id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        if (data.messages.length > 0) {
          setLastMessageTimestamp(data.messages[data.messages.length - 1].createdAt);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !session?.user) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUser._id,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getFilteredUsers = () => {
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role.toLowerCase() === selectedRole);
    }

    return filtered;
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'mentor':
        return {
          icon: UsersIcon,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          label: 'Mentor'
        };
      case 'researcher':
        return {
          icon: BeakerIcon,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          label: 'Researcher'
        };
      case 'fundingagency':
        return {
          icon: Building2Icon,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          label: 'Funding Agency'
        };
      case 'startup':
        return {
          icon: Rocket,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          label: 'Startup'
        };
      default:
        return {
          icon: User,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          label: role
        };
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        <div className={`md:col-span-4 lg:col-span-3 h-full bg-background ${
          selectedUser ? 'hidden md:block' : 'block'
        }`}>
          <div className="p-4 md:p-4 bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/your-avatar.png" />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">Messages</h2>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-4">
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="mentor">Mentors</SelectItem>
                  <SelectItem value="researcher">Researchers</SelectItem>
                  <SelectItem value="fundingAgency">Funding Agencies</SelectItem>
                  <SelectItem value="startup">Startups</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 bg-background"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="flex flex-col">
              {getFilteredUsers().map((user) => {
                const roleInfo = getRoleIcon(user.role);
                const RoleIcon = roleInfo.icon;
                
                return (
                  <motion.div
                    key={user._id}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    className={`p-3 cursor-pointer hover:bg-accent/50 ${
                      selectedUser?._id === user._id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.image} />
                          <AvatarFallback className={cn(roleInfo.bgColor, roleInfo.color)}>
                            <RoleIcon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium truncate">{user.name}</p>
                            <div className="flex items-center gap-1.5">
                              <span className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                roleInfo.bgColor,
                                roleInfo.color
                              )}>
                                <RoleIcon className="h-3 w-3" />
                                {roleInfo.label}
                              </span>
                            </div>
                          </div>
                          {user.lastMessageTime && (
                            <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {new Date(user.lastMessageTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                            {user.lastMessage}
                          </p>
                          {user.unreadCount ? (
                            <span className={cn(
                              "ml-2 text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1",
                              roleInfo.bgColor,
                              roleInfo.color
                            )}>
                              {user.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className={`md:col-span-8 lg:col-span-9 h-full bg-background ${
          selectedUser ? 'block' : 'hidden md:block'
        }`}>
          {selectedUser ? (
            <div className="flex flex-col h-full">
              <div className="p-2 md:p-4 bg-primary/5 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="md:hidden"
                      onClick={() => setSelectedUser(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedUser.image} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-base">{selectedUser.name}</h2>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {selectedUser.isOnline ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Online
                          </>
                        ) : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-2 md:p-4 bg-accent/20">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender._id === session?.user?.id ? "justify-end" : "justify-start"
                      } mb-4`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 ${
                          message.sender._id === session?.user?.id
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <p className="text-xs opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {message.sender._id === session?.user?.id && (
                            message.isRead ? (
                              <CheckCheck className="h-3 w-3 text-blue-400" />
                            ) : (
                              <Check className="h-3 w-3 opacity-70" />
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="p-2 md:p-4 bg-background border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0 hidden md:inline-flex">
                    <Smile className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="shrink-0 hidden md:inline-flex">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Input
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                <p className="text-sm max-w-sm">
                  Send private messages to your mentors, investors, and other startup connections
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
