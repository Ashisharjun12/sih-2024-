"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

export function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || !session?.user) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[90%] max-w-[400px] p-6 shadow-lg relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Welcome! 👋</h2>
          <p className="text-lg">
            Hello, <span className="font-semibold">{session.user.name}</span>
          </p>
          <p className="text-muted-foreground capitalize">
            Role: {session.user.role || "User"}
          </p>
        </div>
      </Card>
    </div>
  );
} 