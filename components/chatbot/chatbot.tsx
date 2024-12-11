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

const startupPrePrompts = [
  {
    role: "assistant",
    content: "👋 Welcome to the Startup Support Hub! I can help you with:\n\n" +
      "• Starting up in Gujarat\n" +
      "• Funding opportunities\n" +
      "• Government policies\n" +
      "• Connecting with mentors\n" +
      "• IPR registration\n\n" +
      "What would you like to know more about?"
  },
  {
    role: "assistant",
    content: "As a startup in Gujarat, you have access to various benefits:\n\n" +
      "• Seed funding up to ₹20 lakhs\n" +
      "• Tax benefits and subsidies\n" +
      "• Incubation support\n" +
      "• Networking opportunities\n\n" +
      "Would you like me to explain any of these in detail?"
  }
];

const ROLE_TITLES = {
  startup: "Let's Grow Together! 🚀",
  researcher: "Innovate & Discover 🔬",
  mentor: "Guide & Inspire 🌟",
  iprProfessional: "Protect & Innovate 💡",
  fundingAgency: "Invest in Innovation 💰",
  policyMaker: "Shape the Future 📋",
  default: "Gujarat Innovation Hub 🌱"
};

export function Chatbot({ pageContext = "general" }: { pageContext?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen && messages.length === 0 && session?.user) {
      const initialMessage = {
        role: "assistant" as const,
        content: `Hello ${session.user.name}! How can I assist you today?`
      };

      if (pageContext === "startup") {
        setMessages([initialMessage, ...startupPrePrompts]);
      } else {
        setMessages([initialMessage]);
      }
    }
  }, [isOpen, session, pageContext]);

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
          <div className="flex justify-between items-center mb-4 bg-primary/10 p-3 rounded-lg">
            <div className="flex flex-col">
              <h3 className="font-semibold text-primary">
                {ROLE_TITLES[session?.user?.role as keyof typeof ROLE_TITLES] || ROLE_TITLES.default}
              </h3>
              <p className="text-xs text-muted-foreground">AI Assistant</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-primary/20">
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