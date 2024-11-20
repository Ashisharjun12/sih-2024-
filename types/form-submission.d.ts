interface FormSubmission {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  formType: "startup" | "researcher" | "iprProfessional" | "policyMaker" | "fundingAgency" | "mentor";
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  formData: any;
  files?: Record<string, {
    public_id: string;
    secure_url: string;
    originalName: string;
    fileType: string;
  }>;
  createdAt: string;
  updatedAt: string;
} 