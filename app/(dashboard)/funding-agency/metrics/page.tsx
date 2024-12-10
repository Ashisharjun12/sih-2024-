"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StartupCard } from "@/components/startup/startup-card";

interface Startup {
    _id: string;
    startupDetails: {
        startupName: string;
        startupLogo?: {
            secure_url: string;
        };
        industries: string[];
        stage: string;
    };
}

export default function MetricsPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchStartups();
    }, []);

    const fetchStartups = async () => {
        try {
            const response = await fetch("/api/startups");
            if (!response.ok) throw new Error("Failed to fetch startups");
            const data = await response.json();
            setStartups(data.startups);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch startups",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Startups</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {startups.map((startup, index) => (
                                <StartupCard key={startup._id} startup={startup} index={index} />
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
