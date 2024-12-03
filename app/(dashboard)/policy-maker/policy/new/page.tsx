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
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Policy Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
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
                placeholder="Describe the policy"
                rows={4}
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
                placeholder="Enter policy vision"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Objectives</Label>
              <div className="flex gap-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Add an objective"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddObjective}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.objectives.map((objective, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {objective}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveObjective(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sectors</Label>
              <Select onValueChange={handleSectorChange}>
                <SelectTrigger>
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
                    className="flex items-center gap-1"
                  >
                    {sector}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleSectorChange(sector)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Industries</Label>
              <Select onValueChange={handleIndustryChange}>
                <SelectTrigger>
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
                    className="flex items-center gap-1"
                  >
                    {industry}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleIndustryChange(industry)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
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
