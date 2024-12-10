"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { FileText, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  publicationDate: string;
  stage: string;
  doi?: string;
  images: Array<{
    public_id: string;
    secure_url: string;
  }>;
  isFree: boolean;
  price?: number;
  isPublished: boolean;
}

interface NewPaper {
  title: string;
  description: string;
  publicationDate: string;
  stage: string;
  doi: string;
  isFree: boolean;
  price?: number;
  images: Array<{
    public_id: string;
    secure_url: string;
  }>;
}

export default function ResearchPapersPage() {
  const { toast } = useToast();
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPaper, setNewPaper] = useState<Omit<ResearchPaper, '_id'>>({
    title: "",
    description: "",
    publicationDate: new Date().toISOString().split('T')[0],
    stage: "Identifying a Research Problem or Question",
    doi: "",
    images: [],
    isPublished: false,
    isFree: true,
    price: undefined
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await fetch('/api/researcher/papers');
      const data = await res.json();
      if (data.papers) {
        setPapers(data.papers);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch research papers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newPaper.title || !newPaper.description || !newPaper.stage) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedFiles = [];
      if (selectedFiles && selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const formData = new FormData();
          formData.append('file', selectedFiles[i]);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          const uploadData = await uploadRes.json();
          if (!uploadData.public_id || !uploadData.secure_url) {
            throw new Error("Failed to upload document");
          }

          uploadedFiles.push({
            public_id: uploadData.public_id,
            secure_url: uploadData.secure_url
          });
        }
      }

      const res = await fetch('/api/researcher/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPaper,
          images: uploadedFiles,
          doi: newPaper.doi || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Research paper created successfully",
        });
        setShowAddDialog(false);
        fetchPapers();
        setNewPaper({
          title: "",
          description: "",
          publicationDate: new Date().toISOString().split('T')[0],
          stage: "Identifying a Research Problem or Question",
          doi: "",
          images: [],
          isPublished: false,
          isFree: true,
          price: undefined
        });
        setSelectedFiles(null);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create research paper",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).every(file => {
        const validTypes = ['.pdf', '.doc', '.docx'];
        const isValidType = validTypes.some(type => 
          file.name.toLowerCase().endsWith(type)
        );
        const isValidSize = file.size <= 10 * 1024 * 1024;

        return isValidType && isValidSize;
      });

      if (!validFiles) {
        toast({
          title: "Invalid Files",
          description: "Please upload only PDF, DOC, or DOCX files under 10MB",
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }

      setSelectedFiles(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(newPaper);

    try {
      newPaper.price = Number(newPaper.price);
      const response = await fetch("/api/researcher/papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPaper),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add research paper");
      }

      toast({
        title: "Success",
        description: "Research paper added successfully",
      });

      // Reset the form
      setNewPaper({
        title: "",
        description: "",
        publicationDate: "",
        stage: "Identifying a Research Problem or Question",
        doi: "",
        images: [],
        isFree: false,
        price: undefined,
        isPublished: false,
      });

      // Fetch updated research papers
      fetchResearchPapers();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add research paper",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Research Papers</h1>
            <p className="text-muted-foreground mt-2">Manage and track your research papers</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Research
          </Button>
        </div>
      </div>

      {/* Papers List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Papers</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {papers.length > 0 ? (
            <div className="grid gap-4">
              {papers.map((paper, index) => (
                <Card key={paper._id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{paper.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {paper.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{paper.stage}</Badge>
                          {paper.isFree ? (
                            <Badge variant="outline" className="text-green-600">Free</Badge>
                          ) : (
                            <Badge variant="outline" className="text-blue-600">
                              ₹{paper.price}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Research Papers</h3>
              <p className="text-sm text-muted-foreground">
                Get started by creating your first research paper
              </p>
            </div>
          )}
        </TabsContent>

        {/* Similar content for other tabs */}
      </Tabs>

      {/* Add Research Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto scrollbar-custom">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
            <DialogTitle>Add New Research Paper</DialogTitle>
            <DialogDescription>
              Create a new research paper to track your research progress
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter research paper title"
                value={newPaper.title}
                onChange={(e) => setNewPaper(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter research description"
                value={newPaper.description}
                onChange={(e) => setNewPaper(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publicationDate">Publication Date *</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  value={newPaper.publicationDate}
                  onChange={(e) => setNewPaper(prev => ({ 
                    ...prev, 
                    publicationDate: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doi">DOI (Optional)</Label>
                <Input
                  id="doi"
                  placeholder="Enter DOI"
                  value={newPaper.doi}
                  onChange={(e) => setNewPaper(prev => ({ ...prev, doi: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Research Stage *</Label>
              <Select
                value={newPaper.stage}
                onValueChange={(value) => setNewPaper(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Identifying a Research Problem or Question">
                    Identifying a Research Problem or Question
                  </SelectItem>
                  <SelectItem value="Conducting a Literature Review">
                    Conducting a Literature Review
                  </SelectItem>
                  <SelectItem value="Formulating a Hypothesis or Research Objective">
                    Formulating a Hypothesis or Research Objective
                  </SelectItem>
                  <SelectItem value="Designing the Research Methodology">
                    Designing the Research Methodology
                  </SelectItem>
                  <SelectItem value="Data Collection">
                    Data Collection
                  </SelectItem>
                  <SelectItem value="Data Analysis">
                    Data Analysis
                  </SelectItem>
                  <SelectItem value="Interpreting Results">
                    Interpreting Results
                  </SelectItem>
                  <SelectItem value="Drawing Conclusions">
                    Drawing Conclusions
                  </SelectItem>
                  <SelectItem value="Reporting and Presenting Findings">
                    Reporting and Presenting Findings
                  </SelectItem>
                  <SelectItem value="Publishing or Disseminating Results">
                    Publishing or Disseminating Results
                  </SelectItem>
                  <SelectItem value="Reflection and Future Research">
                    Reflection and Future Research
                  </SelectItem>
                  <SelectItem value="Completed">
                    Completed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Documents</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleFileChange}
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX (Max 10MB each)
                    </p>
                    {selectedFiles && selectedFiles.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-green-600">
                          {selectedFiles.length} file(s) selected
                        </p>
                        <ul className="mt-2 text-sm text-left">
                          {Array.from(selectedFiles).map((file, index) => (
                            <li key={index} className="text-muted-foreground">
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-background pt-4 border-t">
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting || !newPaper.title || !newPaper.description}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Research Paper
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
