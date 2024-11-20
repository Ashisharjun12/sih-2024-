"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  MoreVertical,
  Loader2,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FormSubmission {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  formType: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  formData: any;
  files?: Record<string, { secure_url: string; originalName: string }>;
}

export default function AdminFormsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchFormSubmissions();
  }, []);

  const fetchFormSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/forms");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setFormSubmissions(data.submissions);
      } else {
        throw new Error(data.error || "Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch form submissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (submissionId: string, action: "approve" | "reject") => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/forms/${submissionId}/${action}`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: `Application ${action}ed successfully`,
      });

      // Refresh submissions
      await fetchFormSubmissions();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} application`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { color: "bg-yellow-500", icon: Clock },
      approved: { color: "bg-green-500", icon: CheckCircle },
      rejected: { color: "bg-red-500", icon: XCircle },
    };
    const { color, icon: Icon } = variants[status as keyof typeof variants];
    
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <Badge variant="outline" className={`${color} text-white`}>
          {status.toUpperCase()}
        </Badge>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Role Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Role Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formSubmissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{submission.userName}</span>
                      <span className="text-sm text-muted-foreground">
                        {submission.userEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{submission.formType}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/forms/${submission._id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {submission.files && Object.entries(submission.files).map(([key, file]) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => window.open(file.secure_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            View {key.replace(/([A-Z])/g, ' $1').trim()}
                          </DropdownMenuItem>
                        ))}
                        {submission.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleAction(submission._id, "approve")}
                              disabled={processing}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(submission._id, "reject")}
                              disabled={processing}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 