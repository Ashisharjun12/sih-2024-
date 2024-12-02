import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  officialAddress: { type: String, required: true },
  officialEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  websiteURL: { type: String },
});

const representativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const fundingPreferencesSchema = new mongoose.Schema({
  investmentRange: {
    minimum: { type: Number, required: true },
    maximum: { type: Number, required: true }
  },
  preferredStages: [{
    type: String,
    enum: ['Ideation', 'Validation', 'Early_Traction', 'Scaling', 'Growth']
  }],
  fundingTypes: [{
    type: String,
    enum: [
      'Equity_Funding',
      'Debt_Funding',
      'Grants',
      'Convertible_Notes',
      'Revenue_Based_Financing',
      'Scholarship'
    ]
  }],
  preferredSectors: [{
    type: String,
    enum: [
      'Technology',
      'Healthcare',
      'Education',
      'Finance',
      'Agriculture',
      'Clean_Energy',
      'Manufacturing',
      'Other'
    ]
  }],
  disbursementMode: {
    type: String,
    enum: ['Direct_Transfer', 'Installments', 'Milestone_Based'],
    required: true
  }
});

const documentationSchema = new mongoose.Schema({
  registrationCertificate: {
    public_id: String,
    secure_url: String,
  },
  governmentApprovals: {
    public_id: String,
    secure_url: String,
  },
  addressProof: {
    public_id: String,
    secure_url: String,
  },
  taxDocuments: {
    public_id: String,
    secure_url: String,
  },
  portfolioDocument: {
    public_id: String,
    secure_url: String,
  }
});

const fundingAgencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  owner: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    businessAddress: {
      physicalAddress: { type: String, required: true },
    },
  },
  agencyDetails: {
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'Venture_Capital',
        'Angel_Network',
        'Crowdfunding_Platform',
        'Government_Body',
        'Financial_Institution',
        'Corporate_Investor',
        'NGO_Foundation'
      ],
      required: true
    },
    establishmentDate: { type: Date, required: true },
    description: { type: String, required: true },
  },
  contactInformation: contactSchema,
  representatives: [representativeSchema],
  fundingPreferences: fundingPreferencesSchema,
  documentation: documentationSchema,
  experience: {
    yearsOfOperation: { type: Number, required: true },
    totalInvestments: { type: Number, default: 0 },
    averageTicketSize: { type: Number },
    successfulExits: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Suspended', 'Inactive'],
    default: 'Pending'
  },
  activeInvestments: [{
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    amount: Number,
    date: Date,
    status: {
      type: String,
      enum: ['Proposed', 'In_Progress', 'Completed', 'Cancelled']
    },
    documents: [{
      title: String,
      public_id: String,
      secure_url: String
    }]
  }]
}, { timestamps: true });

const FundingAgency = mongoose.models.FundingAgency || mongoose.model("FundingAgency", fundingAgencySchema);

export default FundingAgency; 

