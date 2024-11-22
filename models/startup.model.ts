import mongoose from "mongoose";

const founderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  contactDetails: { type: String, required: true },
});

const equitySplitSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  equityPercentage: { type: Number, required: true, min: 0, max: 100 },
});

const directorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  contactDetails: { type: String, required: true },
});

const startupSchema = new mongoose.Schema({
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
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  },
  startupDetails: {
    startupName: { type: String, required: true },
    industry: { type: String, required: true },
    stage: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    incorporationDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    businessModel: { type: String, required: true },
    revenueModel: {
      type: String,
      enum: [
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
      ],
      required: true
    },
    founders: [founderSchema],
    equitySplits: [equitySplitSchema],
    directors: [directorSchema],
    ownershipPercentage: { type: Number, required: true },
  },
  financialDetails: {
    bankDetails: {
      bankName: { type: String, required: true },
      branch: { type: String, required: true },
      accountNumber: { type: String, required: true },
    },
    annualTurnover: { type: Number },
    fundingStatus: { type: String },
    amountRaised: { type: Number },
  },
  businessActivities: {
    missionAndVision: { type: String, required: true },
    intellectualProperty: [{
      type: { type: String, required: true },
      details: { type: String, required: true },
    }],
  },
  legalAndCompliance: {
    gstin: { type: String },
    licenses: [{
      type: {
        type: String,
        enum: [
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
        ]
      },
      number: String,
      validUntil: Date
    }],
    certifications: [{
      type: {
        type: String,
        enum: [
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
        ]
      },
      certificationNumber: String,
      issuingAuthority: String,
      validUntil: Date,
      certificationDetails: String
    }],
    auditorDetails: {
      name: String,
      firm: String,
      contact: String,
      email: String,
      registrationNumber: String
    }
  },
  supportAndNetworking: {
    supportRequested: [String],
    mentorshipPrograms: String,
    potentialInvestors: String,
  },
  additionalInfo: {
    website: String,
    socialMedia: {
      linkedIn: String,
      facebook: String,
      twitter: String,
    },
    pitchDeck: {
      public_id: String,
      secure_url: String,
    },
    documents: [{
      public_id: String,
      secure_url: String,
    }],
  },
  allIPR: [{
    ipr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IPR',
    },
    iprProffessional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IPRProffessional',
    },
    message: String
  }],
}, { timestamps: true });

const Startup = mongoose.models.Startup || mongoose.model("Startup", startupSchema);
export default Startup; 