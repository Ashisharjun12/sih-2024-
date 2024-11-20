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
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    businessAddress: z.object({
      physicalAddress: z.string(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
    }),
    dateOfBirth: z.string(),
    gender: z.string(),
    identityProof: z.object({
      type: z.string(),
      number: z.string(),
    }),
  }),
  startupDetails: z.object({
    startupName: z.string(),
    industry: z.string(),
    customIndustry: z.string().optional(),
    stage: z.string(),
    registrationNumber: z.string(),
    incorporationDate: z.string(),
    businessModel: z.string(),
    revenueModel: z.string(),
    founders: z.array(z.object({
      name: z.string(),
      role: z.string(),
      contactDetails: z.string(),
    })),
    equitySplits: z.array(z.object({
      ownerName: z.string(),
      equityPercentage: z.number(),
    })),
    directors: z.array(z.object({
      name: z.string(),
      role: z.string(),
      contactDetails: z.string(),
    })),
    ownershipPercentage: z.number(),
    gstNumber: z.string(),
    panNumber: z.string(),
    cinNumber: z.string(),
    msmeRegistration: z.string(),
  }),
  financialDetails: z.object({
    bankDetails: z.object({
      bankName: z.string(),
      branch: z.string(),
      accountNumber: z.string(),
    }),
    annualTurnover: z.number(),
    fundingStatus: z.string(),
    amountRaised: z.number(),
  }),
  businessActivities: z.object({
    missionAndVision: z.string(),
    intellectualProperty: z.array(z.object({
      type: z.string(),
      details: z.string(),
    })),
  }),
  legalAndCompliance: z.object({
    gstin: z.string(),
    licenses: z.array(z.object({
      type: z.string(),
      number: z.string(),
    })),
    certifications: z.array(z.object({
      type: z.string(),
      certificationNumber: z.string(),
      issuingAuthority: z.string(),
      validUntil: z.string(),
      certificationDetails: z.string(),
    })),
    auditorDetails: z.object({
      name: z.string(),
      firm: z.string(),
      contact: z.string(),
      email: z.string(),
      registrationNumber: z.string(),
    }),
  }),
  supportAndNetworking: z.object({
    supportRequested: z.array(z.string()),
    mentorshipPrograms: z.string(),
    potentialInvestors: z.string(),
  }),
  additionalInfo: z.object({
    website: z.string(),
    socialMedia: z.object({
      linkedIn: z.string(),
      twitter: z.string(),
    }),
  }),
}).partial(); 