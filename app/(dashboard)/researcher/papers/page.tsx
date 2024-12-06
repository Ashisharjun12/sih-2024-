"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResearchPaperCard } from "@/components/researcher/research-paper-card";
import { Plus, Loader2, File, X, PlusCircle, PlusSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  publicationDate: string;
  stage: string;
  doi?: string;
  images: Array<{ public_id: string; secure_url: string }>;
  isFree: boolean;
  price?: number;
}

interface NewPaper {
  title: string;
  description: string;
  publicationDate: string;
  stage: string;
  doi: string;
  isFree: boolean;
  price: number | undefined;
  images: Array<{ public_id: string; secure_url: string }>;
}

export default function ResearchPapersPage() {
  const { toast } = useToast();
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPaper, setNewPaper] = useState<NewPaper>({
    title: "",
    description: "",
    publicationDate: "",
    stage: "Identifying a Research Problem or Question",
    doi: "",
    isFree: true,
    price: undefined,
    images: []
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch("/api/researcher/papers");
      if (!response.ok) throw new Error("Failed to fetch papers");
      const data = await response.json();
      setPapers(data.papers);
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

  const completedPapers = papers.filter(paper => paper.stage === "Completed");
  const ongoingPapers = papers.filter(paper => paper.stage !== "Completed");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPaper(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/researcher/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPaper),
      });

      if (!response.ok) throw new Error("Failed to create research paper");

      toast({
        title: "Success",
        description: "Research paper created successfully",
      });

      setIsDialogOpen(false);
      fetchPapers();
      setNewPaper({
        title: "",
        description: "",
        publicationDate: "",
        stage: "Identifying a Research Problem or Question",
        doi: "",
        isFree: true,
        price: undefined,
        images: []
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create research paper",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error(`Failed to upload ${file.name}`);

        const data = await response.json();
        setNewPaper(prev => ({
          ...prev,
          images: [...prev.images, { 
            public_id: data.public_id, 
            secure_url: data.secure_url 
          }]
        }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-black/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Research Papers</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Manage and track all your research papers
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hidden md:flex"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Research
          </Button>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <Button
        className="fixed z-50 right-4 bottom-16 h-12 w-12 rounded-full shadow-lg md:hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Research Papers Tabs */}
      <Tabs defaultValue="ongoing" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="ongoing" className="flex items-center gap-2">
            Ongoing Research
            {ongoingPapers.length > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {ongoingPapers.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            Completed Papers
            {completedPapers.length > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {completedPapers.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="space-y-6">
          {ongoingPapers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ongoingPapers.map((paper, index) => (
                <ResearchPaperCard 
                  key={paper._id} 
                  paper={paper} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">
                No ongoing research papers
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start a new research project by clicking the Add Research button.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedPapers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedPapers.map((paper, index) => (
                <ResearchPaperCard 
                  key={paper._id} 
                  paper={paper} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">
                No completed research papers
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your completed research papers will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto scrollbar-hide">
          <DialogHeader className="sticky top-0 z-10 bg-background pb-4">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 -mt-6 -mx-6">
              <div className="absolute inset-0 bg-grid-black/5" />
              <div className="relative">
                <DialogTitle className="text-2xl font-bold">Create New Research</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Share your research work with the community
                </p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-8 px-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90">Research Title</label>
                <Input
                  name="title"
                  value={newPaper.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your research title"
                  className="bg-muted/50 border-slate-200/60 focus:border-blue-500/30 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90">Abstract</label>
                <Textarea
                  name="description"
                  value={newPaper.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your research"
                  className="bg-muted/50 border-slate-200/60 focus:border-blue-500/30 transition-colors resize-none min-h-[120px]"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/90">Publication Date</label>
                  <Input
                    type="date"
                    name="publicationDate"
                    value={newPaper.publicationDate}
                    onChange={handleInputChange}
                    required
                    className="bg-muted/50 border-slate-200/60 focus:border-blue-500/30 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/90">Research Stage</label>
                  <select
                    name="stage"
                    value={newPaper.stage}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-200/60 bg-muted/50 px-3 py-2 text-sm ring-offset-background focus:border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                    required
                  >
                    <option value="Identifying a Research Problem or Question">Identifying Research Problem</option>
                    <option value="Conducting a Literature Review">Literature Review</option>
                    <option value="Data Collection">Data Collection</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Reporting and Presenting Findings">Reporting Findings</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90">DOI (Optional)</label>
                <Input
                  name="doi"
                  value={newPaper.doi}
                  onChange={handleInputChange}
                  placeholder="Enter DOI if available"
                  className="bg-muted/50 border-slate-200/60 focus:border-blue-500/30 transition-colors"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground/90">Access Type</label>
                <div className="flex flex-col space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isFree"
                      checked={newPaper.isFree}
                      onChange={() => setNewPaper(prev => ({
                        ...prev,
                        isFree: true,
                        price: undefined
                      }))}
                      className="text-primary"
                    />
                    <div>
                      <span className="text-sm font-medium">Free Access</span>
                      <p className="text-xs text-muted-foreground">Make your research freely available to everyone</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isFree"
                      checked={!newPaper.isFree}
                      onChange={() => setNewPaper(prev => ({
                        ...prev,
                        isFree: false,
                        price: 0
                      }))}
                      className="text-primary"
                    />
                    <div>
                      <span className="text-sm font-medium">Premium</span>
                      <p className="text-xs text-muted-foreground">Set a price for accessing your research</p>
                    </div>
                  </label>

                  {!newPaper.isFree && (
                    <div className="ml-6 pl-2 border-l-2 border-muted">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">
                          Price (₹)
                        </label>
                        <Input
                          type="number"
                          name="price"
                          value={newPaper.price || ''}
                          onChange={(e) => setNewPaper(prev => ({
                            ...prev,
                            price: e.target.value ? Number(e.target.value) : 0
                          }))}
                          placeholder="Enter price in INR"
                          min="0"
                          step="1"
                          required
                          className="bg-muted/50 max-w-[200px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Set a reasonable price for your research paper
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-slate-200/60">
                <label className="text-sm font-semibold text-foreground/90">Upload Documents</label>
                <div className="space-y-3">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    className="bg-white/50 border-slate-200/60 focus:border-blue-500/30 transition-colors"
                  />
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading documents...</span>
                    </div>
                  )}
                  {newPaper.images.length > 0 && (
                    <div className="grid gap-2">
                      {newPaper.images.map((image, index) => (
                        <div 
                          key={image.public_id}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Document {index + 1}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setNewPaper(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 pt-6 border-t border-slate-200/60 bg-background/80 backdrop-blur-sm">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Research...
                  </>
                ) : (
                  'Create Research'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}