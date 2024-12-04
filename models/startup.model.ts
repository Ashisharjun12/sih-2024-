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
    industry: {
      type: [String],
      enum: [
        'Advertising',
        'Aeronautics Aerospace & Defence',
        'Agriculture',
        'AI',
        'Airport Operations',
        'Analytics',
        'Animation',
        'AR VR (Augmented + Virtual Reality)',
        'Architecture Interior Design',
        'Art & Photography',
        'Automotive',
        'Biotechnology',
        'Chemicals',
        'Computer Vision',
        'Construction',
        'Dating Matrimonial',
        'Design',
        'Education',
        'Enterprise Software',
        'Events',
        'Fashion',
        'Finance Technology',
        'Food & Beverages',
        'Green Technology',
        'Healthcare & Lifesciences',
        'House-Hold Services',
        'Human Resources',
        'Indic Language Startups',
        'Internet of Things',
        'IT Services',
        'Logistics',
        'Marketing',
        'Media & Entertainment',
        'Nanotechnology',
        'Non- Renewable Energy',
        'Other Specialty Retailers',
        'Others',
        'Passenger Experience',
        'Pets & Animals',
        'Professional & Commercial Services',
        'Real Estate',
        'Renewable Energy',
        'Retail',
        'Robotics',
        'Safety',
        'Security Solutions',
        'Social Impact',
        'Social Network',
        'Sports',
        'Technology Hardware',
        'Telecommunication & Networking',
        'Textiles & Apparel',
        'Toys and Games',
        'Transportation & Storage',
        'Travel & Tourism',
        'Waste Management'
      ],
      required: true
    },
    stage: {
      type: String,
      enum: [
        'Ideation',
        'Validation',
        'Scaling',
        'Expansion'
      ],
      required: true
    },
    registrationNumber: { type: String, required: true },
    incorporationDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    businessModel: { type: String, enum: ['B2B', 'B2C', 'B2B2C', 'Other'], required: true },
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
  },
  businessActivities: {
    missionAndVision: { type: String, required: true },
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
  },    
  isActivelyFundraising: { type: Boolean, default: false },
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
    identityProof: {
      public_id: String,
      secure_url: String,
    },
    businessPlan: {
      public_id: String,
      secure_url: String,
    },
    financialProjections: {
      public_id: String,
      secure_url: String,
    },
    incorporationCertificate: {
      public_id: String,
      secure_url: String,
    },
  },
  allIPR: [{
    ipr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IPR',
    },
    iprProfessional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String
  }],
}, { timestamps: true });

const Startup = mongoose.models.Startup || mongoose.model("Startup", startupSchema);
export default Startup;