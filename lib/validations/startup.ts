import * as z from "zod";

export const revenueModelEnum = [
  "Subscription",
  "SaaS",
  "Product_Sales",
  "Service_Based",
  "Marketplace",
  "Advertising",
  "Freemium",
  "Licensing",
  "Commission_Based",
  "Other"
] as const;

export const licenseTypeEnum = [
  "FSSAI",
  "Drug_License",
  "AYUSH",
  "Import_Export",
  "Shop_Establishment",
  "Trade_License",
  "Factory_License",
  "ESI_Registration",
  "PF_Registration",
  "Professional_Tax",
  "Other"
] as const;

export const certificationTypeEnum = [
  "ISO_9001",
  "ISO_27001",
  "CE_Mark",
  "GMP",
  "HACCP",
  "Halal",
  "CMMI",
  "BIS",
  "ROHS",
  "Other"
] as const;

export const startupFormSchema = z.object({
  owner: z.object({
    fullName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    businessAddress: z.object({
      physicalAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    identityProof: z.object({
      type: z.string().optional(),
      number: z.string().optional(),
    }).optional(),
  }).optional(),
  startupDetails: z.object({
    startupName: z.string().optional(),
    industry: z.string().optional(),
    customIndustry: z.string().optional(),
    stage: z.string().optional(),
    businessModel: z.string().optional(),
    revenueModel: z.string().optional(),
    incorporationDate: z.string().optional(),
    founders: z.array(z.object({
      name: z.string().optional(),
      role: z.string().optional(),
      contactDetails: z.string().optional(),
    })).optional(),
    equitySplits: z.array(z.object({
      ownerName: z.string().optional(),
      equityPercentage: z.number().optional(),
    })).optional(),
    gstNumber: z.string().optional(),
    panNumber: z.string().optional(),
    cinNumber: z.string().optional(),
    msmeRegistration: z.string().optional(),
  }).optional(),
  financialDetails: z.object({
    bankDetails: z.object({
      bankName: z.string().optional(),
      branch: z.string().optional(),
      accountNumber: z.string().optional(),
    }).optional(),
    annualTurnover: z.number().optional(),
    fundingStatus: z.string().optional(),
    amountRaised: z.number().optional(),
  }).optional(),
  businessActivities: z.object({
    missionAndVision: z.string().optional(),
    intellectualProperty: z.array(z.object({
      type: z.string().optional(),
      details: z.string().optional(),
    })).optional(),
  }).optional(),
  legalAndCompliance: z.object({
    gstin: z.string().optional(),
    licenses: z.array(z.object({
      type: z.string().optional(),
      number: z.string().optional(),
      validUntil: z.string().optional(),
    })).optional(),
    certifications: z.array(z.object({
      type: z.string().optional(),
      certificationNumber: z.string().optional(),
      issuingAuthority: z.string().optional(),
      validUntil: z.string().optional(),
      certificationDetails: z.string().optional(),
    })).optional(),
    auditorDetails: z.object({
      name: z.string().optional(),
      firm: z.string().optional(),
      contact: z.string().optional(),
      email: z.string().optional(),
      registrationNumber: z.string().optional(),
    }).optional(),
  }).optional(),
  supportAndNetworking: z.object({
    supportRequested: z.array(z.string()).optional(),
    mentorshipPrograms: z.string().optional(),
    potentialInvestors: z.string().optional(),
  }).optional(),
  additionalInfo: z.object({
    website: z.string().optional(),
    socialMedia: z.object({
      linkedIn: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
    }).optional(),
  }).optional(),
}).passthrough(); 