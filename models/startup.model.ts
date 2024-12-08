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
  },
  startupDetails: {
    startupName: { type: String, required: true },
    startupLogo: {
      public_id: String,
      secure_url: String,
    },
    about: { type: String, required: true },
    industries: {
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
    sectors: {
      type: [String],
      enum: [
          '3d printing',
          'Accounting',
          'AdTech',
          'Advisory',
          'Agri-Tech',
          'Agricultural Chemicals',
          'Animal Husbandry',
          'Apparel',
          'Apparel & Accessories',
          'Application Development',
          'Art',
          'Assistance Technology',
          'Auto & Truck Manufacturers',
          'Auto Vehicles, Parts & Service Retailers',
          'Auto, Truck & Motorcycle Parts',
          'Aviation & Others',
          'Baby Care',
          'Big Data',
          'Billing and Invoicing',
          'Biotechnology',
          'Bitcoin and Blockchain',
          'BPO',
          'Branding',
          'Business Finance',
          'Business Intelligence',
          'Business Support Services',
          'Business Support Supplies',
          'Clean Tech',
          'Cloud',
          'Coaching',
          'Collaboration',
          'Commercial Printing Services',
          'Commodity Chemicals',
          'Comparison Shopping',
          'Computer & Electronics Retailers',
          'Construction & Engineering',
          'Construction Materials',
          'Construction Supplies & Fixtures',
          'Corporate Social Responsibility',
          'Coworking Spaces',
          'Crowdfunding',
          'Customer Support',
          'CXM',
          'Cyber Security',
          'Dairy Farming',
          'Data Science',
          'Defence Equipment',
          'Digital Marketing (SEO Automation)',
          'Digital Media',
          'Digital Media Blogging',
          'Digital Media News',
          'Digital Media Publishing',
          'Digital Media Video',
          'Discovery',
          'Diversified Chemicals',
          'Drones',
          'E-Commerce',
          'E-learning',
          'Education',
          'Education Technology',
          'Electric Vehicles',
          'Electronics',
          'Embedded',
          'Employment Services',
          'Enterprise Mobility',
          'Entertainment',
          'Environmental Services & Equipment',
          'ERP',
          'Events Management',
          'Experiential Travel',
          'Facility Management',
          'Fan Merchandise',
          'Fantasy Sports',
          'Fashion Technology',
          'Fisheries',
          'Food Processing',
          'Food Technology/Food Delivery',
          'Foreign Exchange',
          'Freight & Logistics Services',
          'Handicraft',
          'Health & Wellness',
          'Healthcare IT',
          'Healthcare Services',
          'Healthcare Technology',
          'Holiday Rentals',
          'Home Care',
          'Home Furnishings Retailers',
          'Home Improvement Products & Services Retailers',
          'Home Security solutions',
          'Homebuilding',
          'Horticulture',
          'Hospitality',
          'Hotel',
          'Housing',
          'Industrial Design',
          'Insurance',
          'Integrated communication services',
          'Internships',
          'IT Consulting',
          'IT Management',
          'Jewellery',
          'KPO',
          'Laundry',
          'Leather Footwear',
          'Leather Textiles Goods',
          'Lifestyle',
          'Location Based',
          'Loyalty',
          'Machine Learning',
          'Manufacture of Electrical Equipment',
          'Manufacture of Machinery and Equipment',
          'Manufacturing',
          'Manufacturing & Warehouse',
          'Market Research',
          'Media and Entertainment',
          'Medical Devices Biomedical',
          'Microbrewery',
          'Microfinance',
          'Mobile wallets Payments',
          'Movies',
          'Natural Language Processing',
          'Network Technology Solutions',
          'New-age Construction Technologies',
          'NGO',
          'NLP',
          'Non- Leather Footwear',
          'Non- Leather Textiles Goods',
          'Oil & Gas Drilling',
          'Oil & Gas Exploration and Production',
          'Oil & Gas Transportation Services',
          'Oil Related Services and Equipment',
          'Online Classified',
          'OOH Media',
          'Organic Agriculture',
          'Others',
          'P2P Lending',
          'Passenger Transportation Services',
          'Payment Platforms',
          'Personal Care',
          'Personal Finance',
          'Personal Security',
          'Pharmaceutical',
          'Photography',
          'Physical Toys and Games',
          'Point of Sales',
          'Product Development',
          'Professional Information Services',
          'Project Management',
          'Public Citizen Security Solutions',
          'Recruitment Jobs',
          'Renewable Energy Solutions',
          'Renewable Nuclear Energy',
          'Renewable Solar Energy',
          'Renewable Wind Energy',
          'Restaurants',
          'Retail Technology',
          'Robotics Application',
          'Robotics Technology',
          'Sales',
          'SCM',
          'Semiconductor',
          'Skill Development',
          'Skills Assessment',
          'Smart Home',
          'Social Commerce',
          'Social Media',
          'Social Media',
          'Space Technology',
          'Specialty Chemicals',
          'Sports Promotion and Networking',
          'Talent Management',
          'Testing',
          'Ticketing',
          'Tires & Rubber Products',
          'Trading',
          'Traffic Management',
          'Training',
          'Transport Infrastructure',
          'Utility Services',
          'Virtual Games',
          'Waste Management',
          'Wayside Amenities',
          'Wearables',
          'Web Design',
          'Web Development',
          'Weddings',
          'Wireless'
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
  activeInvestments: [{
    fundingAgency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FundingAgency'
    },
    amount: Number,
    date: Date,
  }],
  requests: [{
    fundingAgency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FundingAgency'
    },
    message: {
      type: String,
      required: true
    }
  }],
  requested: [{
    fundingAgency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FundingAgency'
    },
    amount: {
      type: Number,
      required: true
    },
    fundingType: {
      type: String,
      enum: ['Debt', 'Equity'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }]
}, { timestamps: true });

const Startup = mongoose.models.Startup || mongoose.model("Startup", startupSchema);
export default Startup;