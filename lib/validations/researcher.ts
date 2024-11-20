import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const researcherFormSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    institution: z.string().min(2, "Institution name is required"),
    department: z.string().min(2, "Department is required"),
    designation: z.string().min(2, "Designation is required"),
    orcid: z.string().min(2, "ORCID ID is required"),
    identityProof: z.object({
      type: z.enum(["Aadhar", "PAN", "Passport"]),
      number: z.string().min(1, "Identity proof number is required"),
      document: z.any(),
    }),
  }),
  academicInfo: z.object({
    highestQualification: z.string().min(2, "Qualification is required"),
    specialization: z.string().min(2, "Specialization is required"),
    yearsOfExperience: z.number().min(0, "Years of experience must be positive"),
    researchInterests: z.array(z.string()).min(1, "At least one research interest is required"),
    publications: z.array(z.object({
      title: z.string().min(2, "Publication title is required"),
      journal: z.string().min(2, "Journal name is required"),
      year: z.number().min(1900, "Invalid year"),
      link: z.string().url("Invalid URL").optional(),
    })).optional(),
  }),
  researchProposal: z.object({
    title: z.string().min(5, "Research title must be at least 5 characters"),
    abstract: z.string().min(100, "Abstract must be at least 100 characters"),
    objectives: z.string().min(50, "Objectives must be at least 50 characters"),
    methodology: z.string().min(50, "Methodology must be at least 50 characters"),
    expectedOutcome: z.string().min(50, "Expected outcome must be at least 50 characters"),
    timeline: z.string().min(20, "Timeline must be at least 20 characters"),
    fundingRequired: z.boolean(),
    fundingAmount: z.number().optional(),
  }),
  documents: z.object({
    cv: z.any(),
    researchPaper: z.any(),
    certificates: z.array(z.any()).optional(),
    otherDocuments: z.array(z.any()).optional(),
  }),
}); 