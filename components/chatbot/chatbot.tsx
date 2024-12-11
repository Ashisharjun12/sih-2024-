"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface QuickAccessItem {
  label: string;
  emoji: string;
  query: string;
}

const getQuickAccessItems = (role: string = "default"): QuickAccessItem[] => {
  switch (role) {
    case "startup":
      return [
        { label: "IPR Registration", emoji: "📝", query: "Tell me about IPR registration process for startups" },
        { label: "Revenue Models", emoji: "📈", query: "Explain different revenue models for startups" },
        { label: "Funding Options", emoji: "💰", query: "What funding options are available for startups" },
        { label: "Government Schemes", emoji: "🏛️", query: "Tell me about government schemes for startups" },
        { label: "Mentor Connect", emoji: "🤝", query: "How can I connect with mentors" }
      ];
    case "researcher":
      return [
        { label: "Patent Filing", emoji: "📝", query: "Guide me through the patent filing process" },
        { label: "Research Grants", emoji: "💰", query: "What research grants are available" },
        { label: "Industry Collaborations", emoji: "🤝", query: "How to establish industry collaborations" },
        { label: "Publication Support", emoji: "📚", query: "Tell me about publication support" },
        { label: "Lab Resources", emoji: "🔬", query: "What lab resources are available" }
      ];
    // ... add other roles similarly ...
    default:
      return [
        { label: "Startup Resources", emoji: "🚀", query: "What startup resources are available" },
        { label: "Research & Innovation", emoji: "🔬", query: "Tell me about research and innovation opportunities" },
        { label: "Funding Options", emoji: "💰", query: "What funding options are available" },
        { label: "Government Support", emoji: "🏛️", query: "Explain government support programs" },
        { label: "Mentorship Programs", emoji: "🌟", query: "Tell me about mentorship programs" }
      ];
  }
};

const getInitialMessages = (role: string = "default", name: string = ""): Message[] => {
  switch (role) {
    case "startup":
      return [
        {
          role: "assistant",
          content: `Hello ${name}! 👋 Here are two trending updates for startups in Gujarat:`
        },
        {
          role: "assistant",
          content: "1. New Startup Policy 2024 offers up to ₹30 lakhs seed funding for innovative startups in emerging tech."
        },
        {
          role: "assistant",
          content: "2. Gujarat's startup ecosystem saw 40% growth in funding last quarter, with focus on DeepTech and CleanTech."
        }
      ];
    case "researcher":
      return [
        {
          role: "assistant",
          content: `Hello ${name}! 👋 Here are two key updates for researchers:`
        },
        {
          role: "assistant",
          content: "1. New research grant program launched with focus on AI and Sustainable Technologies."
        },
        {
          role: "assistant",
          content: "2. Gujarat universities reported 30% increase in industry-sponsored research projects."
        }
      ];
    // ... add other roles similarly ...
    default:
      return [
        {
          role: "assistant",
          content: `Hello ${name}! 👋 Welcome to Gujarat Innovation Hub`
        },
        {
          role: "assistant",
          content: "1. Gujarat ranks #3 in startup ecosystem growth in India"
        },
        {
          role: "assistant",
          content: "2. Over 500 startups received funding support in last 6 months"
        }
      ];
  }
};

export function Chatbot({ pageContext = "general" }: { pageContext?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleQuickAccess = async (query: string) => {
    if (isLoading) return;
    
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages,
          context: {
            page: pageContext,
            userRole: session?.user?.role,
            userName: session?.user?.name
          }
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0 && session?.user) {
      const initialMessages = getInitialMessages(session.user.role, session.user.name);
      setMessages(initialMessages);
    }
  }, [isOpen, session, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages,
          context: {
            page: pageContext,
            userRole: session?.user?.role,
            userName: session?.user?.name
          }
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] h-[500px] flex flex-col p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">AI Assistant</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* Quick Access Buttons */}
              {messages.length > 0 && !isLoading && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Quick access - tap to learn more:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {getQuickAccessItems(session?.user?.role).map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-xs justify-start"
                        onClick={() => handleQuickAccess(item.query)}
                      >
                        <span className="mr-1">{item.emoji}</span>
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          variant="default"
          size="icon"
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
} 