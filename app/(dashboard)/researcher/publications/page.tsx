"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Globe,
  IndianRupee,
  Eye,
  Check,
  Download,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

interface ResearchPaper {
  _id: string;
  title: string;
  description: string;
  stage: string;
  isPublished: boolean;
  isFree: boolean;
  price?: number;
  images: Array<{
    public_id: string;
    secure_url: string;
  }>;
  createdAt: string;
  doi?: string;
}

export default function PublicationsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [publishSettings, setPublishSettings] = useState({
    isFree: true,
    price: "",
  });
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await fetch('/api/researcher/papers/my-papers');
      const data = await res.json();
      if (data.success) {
        setPapers(data.papers);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch papers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedPaper) return;

    // Validate price if not free
    if (!publishSettings.isFree && (!publishSettings.price || Number(publishSettings.price) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price for paid papers",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch(`/api/researcher/papers/${selectedPaper._id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFree: publishSettings.isFree,
          price: publishSettings.isFree ? undefined : Number(publishSettings.price)
        })
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Research paper published successfully",
        });
        setShowPublishModal(false);
        fetchPapers(); // Refresh the list
      } else {
        throw new Error(data.error || "Failed to publish paper");
      }
    } catch (error) {
      console.error('Publishing error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish paper",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Filter papers by status
  const unpublishedPapers = papers.filter(paper => !paper.isPublished);
  const publishedPapers = papers.filter(paper => paper.isPublished);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold">Publications</h1>
          <p className="text-muted-foreground mt-2">
            Manage and publish your research papers
          </p>
        </div>
      </div>

      {/* Papers Tabs */}
      <Tabs defaultValue="unpublished" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unpublished" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Ready to Publish
            <Badge variant="secondary">{unpublishedPapers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Published Papers
            <Badge variant="secondary">{publishedPapers.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Unpublished Papers */}
        <TabsContent value="unpublished">
          <div className="grid gap-6 md:grid-cols-2">
            {unpublishedPapers.map((paper) => (
              <Card key={paper._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-semibold">{paper.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {paper.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{paper.stage}</Badge>
                        <Badge variant="secondary">
                          {new Date(paper.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{paper.images.length} Documents</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/researcher/papers/${paper._id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedPaper(paper);
                            setPublishSettings({
                              isFree: true,
                              price: "",
                            });
                            setShowPublishModal(true);
                          }}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Published Papers */}
        <TabsContent value="published">
          <div className="grid gap-6 md:grid-cols-2">
            {publishedPapers.map((paper) => (
              <Card key={paper._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-semibold">{paper.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {paper.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{paper.stage}</Badge>
                        {paper.isFree ? (
                          <Badge variant="secondary" className="text-green-600">
                            Free
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-blue-600">
                            ₹{paper.price}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {paper.images.map((doc, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.secure_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Document {index + 1}
                          </Button>
                        ))}
                      </div>
                      {paper.doi && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://doi.org/${paper.doi}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          DOI
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Publish Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Research Paper</DialogTitle>
            <DialogDescription>
              Make your research paper available to the public
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPaper && (
              <>
                <div className="space-y-2">
                  <h3 className="font-medium">{selectedPaper.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPaper.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="free">Make it free</Label>
                  <Switch
                    id="free"
                    checked={publishSettings.isFree}
                    onCheckedChange={(checked) => 
                      setPublishSettings(prev => ({ ...prev, isFree: checked }))
                    }
                  />
                </div>

                {!publishSettings.isFree && (
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Enter price"
                        value={publishSettings.price}
                        onChange={(e) => 
                          setPublishSettings(prev => ({ ...prev, price: e.target.value }))
                        }
                        className="pl-9"
                      />
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm Publication
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 