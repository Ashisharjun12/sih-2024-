"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
  isPublished: boolean;
}

const ResearchPaperPage = () => {
  const { toast } = useToast();
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [onGoingResearchPapers, setOnGoingResearchPapers] = useState<
    ResearchPaper[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPaper, setNewPaper] = useState<Partial<ResearchPaper>>({
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchResearchPapers();
  }, []);

  const fetchResearchPapers = async () => {
    try {
      const response = await fetch("/api/researcher/papers");
      if (!response.ok) throw new Error("Failed to fetch research papers");
      const data = await response.json();
      setResearchPapers(
        data.papers.filter(
          (paper: ResearchPaper) => paper.stage === "Completed"
        )
      );
      setOnGoingResearchPapers(
        data.papers.filter(
          (paper: ResearchPaper) => paper.stage !== "Completed"
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch research papers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPaper((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(newPaper);
  };

  const handleCheckboxChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPaper((prev) => ({
        ...prev,
        [name]: e.target.checked,
        price: e.target.checked ? undefined : prev.price,
      }));
      console.log(newPaper);
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

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const uploadedFile = await response.json();
        setNewPaper((prev) => ({
          ...prev,
          images: [...(prev.images || []), uploadedFile],
        }));
      }

      toast({
        title: "Success",
        description: "All images uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = "";
      }
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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Research Papers</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          Add Research Paper
        </Button>
      </div>

      <Tabs defaultValue="completed">
        <TabsList>
          <TabsTrigger value="completed">Completed Research Papers</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing Research Papers</TabsTrigger>
        </TabsList>

        <TabsContent value="completed">
          {researchPapers.map((paper) => (
            <Card key={paper._id} className="mb-4">
              <CardHeader>
                <CardTitle>{paper.title}</CardTitle>
                <Badge variant={paper.isPublished ? "success" : "destructive"}>
                  {paper.isPublished ? "Published" : "Not Published"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p>{paper.description}</p>
                <p>Stage: {paper.stage}</p>
                <p>
                  Publication Date:{" "}
                  {new Date(paper.publicationDate).toLocaleDateString()}
                </p>
                {paper.doi && <p>DOI: {paper.doi}</p>}
                {paper.isPublished && paper.price !== undefined && (
                  <p>Price: ${paper.price}</p>
                )}
                {paper.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {paper.images.map((image) => (
                      <Image
                        key={image.public_id}
                        src={image.secure_url}
                        alt={paper.title}
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover"
                      />
                    ))}
                  </div>
                )}
                {paper.images.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold">Documents:</h4>
                    <ul>
                      {paper.images.map((doc) => (
                        <li key={doc.public_id}>
                          <Link
                            href={doc.secure_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {doc.public_id}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ongoing">
          {onGoingResearchPapers.map((paper) => (
            <Card key={paper._id} className="mb-4">
              <CardHeader>
                <CardTitle>{paper.title}</CardTitle>
                <Badge variant={paper.isPublished ? "success" : "destructive"}>
                  {paper.isPublished ? "Published" : "Not Published"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p>{paper.description}</p>
                <p>Stage: {paper.stage}</p>
                <p>
                  Publication Date:{" "}
                  {new Date(paper.publicationDate).toLocaleDateString()}
                </p>
                {paper.doi && <p>DOI: {paper.doi}</p>}
                {paper.isPublished && paper.price !== undefined && (
                  <p>Price: ${paper.price}</p>
                )}
                {paper.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {paper.images.map((image) => (
                      <Image
                        key={image.public_id}
                        src={image.secure_url}
                        alt={paper.title}
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover"
                      />
                    ))}
                  </div>
                )}
                {paper.images.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold">Documents:</h4>
                    <ul>
                      {paper.images.map((doc) => (
                        <li key={doc.public_id}>
                          <Link
                            href={doc.secure_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {doc.public_id}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Dialog for Adding Research Paper */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Research Paper</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                name="title"
                value={newPaper.title}
                onChange={handleInputChange}
                required
                placeholder="Enter research paper title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={newPaper.description}
                onChange={handleInputChange}
                required
                placeholder="Enter research paper description"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Publication Date</label>
              <Input
                type="date"
                name="publicationDate"
                value={newPaper.publicationDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">DOI (optional)</label>
              <Input
                name="doi"
                value={newPaper.doi}
                onChange={handleInputChange}
                placeholder="Enter DOI"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Stage</label>
              <select
                name="stage"
                value={newPaper.stage}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              >
                <option value="Identifying a Research Problem or Question">
                  Identifying a Research Problem or Question
                </option>
                <option value="Conducting a Literature Review">
                  Conducting a Literature Review
                </option>
                <option value="Formulating a Hypothesis or Research Objective">
                  Formulating a Hypothesis or Research Objective
                </option>
                <option value="Designing the Research Methodology">
                  Designing the Research Methodology
                </option>
                <option value="Data Collection">Data Collection</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Interpreting Results">
                  Interpreting Results
                </option>
                <option value="Drawing Conclusions">Drawing Conclusions</option>
                <option value="Reporting and Presenting Findings">
                  Reporting and Presenting Findings
                </option>
                <option value="Publishing or Disseminating Results">
                  Publishing or Disseminating Results
                </option>
                <option value="Reflection and Future Research">
                  Reflection and Future Research
                </option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Is Published</label>
              <input
                type="checkbox"
                checked={newPaper.isPublished}
                onChange={handleCheckboxChange("isPublished")}
              />
            </div>
            {newPaper.isPublished && (
              <div>
                <label className="text-sm font-medium">Is Free</label>
                <input
                  type="checkbox"
                  checked={newPaper.isFree}
                  onChange={handleCheckboxChange("isFree")}
                />
              </div>
            )}
            {newPaper.isPublished && !newPaper.isFree && (
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="text"
                  name="price"
                  value={newPaper.price?.toString() || ""}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Upload Images</label>
              <Input
                type="file"
                onChange={handleFileUpload}
                accept=".jpg,.jpeg,.png"
                multiple
              />
              {isUploading && (
                <p className="text-sm text-yellow-600">Uploading images...</p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Research Paper"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResearchPaperPage;
