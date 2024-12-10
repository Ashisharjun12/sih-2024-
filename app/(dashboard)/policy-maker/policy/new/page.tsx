"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import { industries, sectors } from "@/lib/constants";

interface FormData {
  title: string;
  description: string;
  vision: string;
  objectives: string[];
  sectors: string[];
  industries: string[];
}

export default function NewPolicyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newObjective, setNewObjective] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    vision: "",
    objectives: [],
    sectors: [],
    industries: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, newObjective.trim()],
    }));
    setNewObjective("");
  };

  const handleRemoveObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const handleSectorChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(value)
        ? prev.sectors.filter((sector) => sector !== value)
        : [...prev.sectors, value],
    }));
  };

  const handleIndustryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.includes(value)
        ? prev.industries.filter((industry) => industry !== value)
        : [...prev.industries, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/policy-maker/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create policy");
      }

      toast({
        title: "Success",
        description: "Policy created successfully",
      });

      router.push("/policy-maker/policy");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create policy",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 md:px-8 py-4 md:py-8 space-y-6 md:space-y-8 mb-16 md:mb-0">
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => router.back()}
            >
              <X className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl md:text-3xl font-bold">Create New Policy</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              Define and implement new policy framework
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-background to-background/80 border-muted/20">
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Policy Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="bg-background/50"
                placeholder="Enter policy title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="bg-background/50 min-h-[100px]"
                placeholder="Describe the policy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vision">Vision</Label>
              <Textarea
                id="vision"
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                required
                className="bg-background/50 min-h-[80px]"
                placeholder="Enter policy vision"
              />
            </div>

            <div className="space-y-2">
              <Label>Objectives</Label>
              <div className="flex gap-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="bg-background/50"
                  placeholder="Add an objective"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddObjective}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.objectives.map((objective, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 transition-colors"
                  >
                    {objective}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => handleRemoveObjective(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Sectors</Label>
                <Select onValueChange={handleSectorChange}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.sectors.map((sector) => (
                    <Badge
                      key={sector}
                      variant="secondary"
                      className="bg-green-500/10 text-green-700 hover:bg-green-500/20 transition-colors"
                    >
                      {sector}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => handleSectorChange(sector)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Industries</Label>
                <Select onValueChange={handleIndustryChange}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select industries" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant="secondary"
                      className="bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 transition-colors"
                    >
                      {industry}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => handleIndustryChange(industry)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Policy"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
