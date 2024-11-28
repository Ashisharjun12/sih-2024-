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
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteModal } from "@/components/ui/delete-modal";

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

// // Add this function to handle dynamic routing
// const getDetailsRoute = (formType: string, submissionId: string) => {
//   console.log("formType",formType);
//   alert(formType);  
//   const routes = {
//     startup: `/admin/forms/startup/${submissionId}`,
//     researcher: `/admin/forms/researcher/${submissionId}`,
//     investor: `/admin/forms/investor/${submissionId}`,
//     mentor: `/admin/forms/mentor/${submissionId}`,
//     iprProfessional: `/admin/forms/ipr-professional/${submissionId}`,
   
//     // Add more roles as needed
//   };
  
  
//   return routes[formType as keyof typeof routes] || `/admin/forms/${submissionId}`;
// };

export default function AdminFormsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formTypeFilter, setFormTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formToDelete, setFormToDelete] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const formTypes = [
    { value: "all", label: "All Types" },
    { value: "startup", label: "Startup" },
    { value: "researcher", label: "Researcher" },
    { value: "investor", label: "Investor" },
    { value: "mentor", label: "Mentor" },
    // Add more roles as needed
  ];

  const statusTypes = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ];

  const filteredSubmissions = formSubmissions.filter(submission => {
    const matchesFormType = formTypeFilter === "all" || submission.formType === formTypeFilter;
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    return matchesFormType && matchesStatus;
  });

  const handleDelete = (submissionId: string) => {
    setFormToDelete(submissionId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/forms/delete?id=${formToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete form submission');
      }

      // Update the forms list
      setFormSubmissions(formSubmissions.filter(form => form._id !== formToDelete));
      
      toast({
        title: "Success",
        description: "Form submission deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete form submission",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setFormToDelete('');
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
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <CardTitle>Role Applications</CardTitle>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="w-[200px]">
                <Select
                  value={formTypeFilter}
                  onValueChange={setFormTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Form Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {formTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setFormTypeFilter("all");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold">{formSubmissions.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Pending</div>
                  <div className="text-2xl font-bold">
                    {formSubmissions.filter(s => s.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Approved</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formSubmissions.filter(s => s.status === "approved").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Rejected</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formSubmissions.filter(s => s.status === "rejected").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
              {filteredSubmissions.map((submission) => (
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/forms/${submission.formType}/${submission._id}`)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {submission.files && Object.entries(submission.files).map(([key, file]) => (
                        <Button
                          key={key}
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.secure_url, '_blank')}
                          title={`View ${key}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ))}

                      {submission.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(submission._id, "approve")}
                            disabled={processing}
                            className="text-green-600 hover:text-green-700"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(submission._id, "reject")}
                            disabled={processing}
                            className="text-red-600 hover:text-red-700"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(submission._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        formId={formToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
} 