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
  minimumInvestment: {
    type: Number,
    required: true
  },
  preferredStages: [{
    type: String,
    enum: ['Ideation', 'Validation', 'Early_Traction', 'Scaling', 'Growth']
  }],
  fundingTypes: [{
    type: String,
    enum: [
      'Private_Equity',
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
    enum: ['3d printing',
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
      'Technology',
      'Healthcare',
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
      'Wireless']
  }],
  preferredIndustries: [{
    type: String,
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
  }],
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

  taxDocuments: {
    public_id: String,
    secure_url: String,
  },
});

const fundingAgencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
    logo: {
      public_id: String,
      secure_url: String
    },
    email:String,
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
  },
  activeInvestments: [{
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    amount: Number,
    fundingType: {
      type: String,
      enum: [
        'Private_Equity',
        'Equity_Funding',
        'Debt_Funding',
        'Grants',
        'Convertible_Notes',
        'Revenue_Based_Financing',
        'Scholarship'
      ],
    },
    date: Date,
  }],
  requests: [{
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    message: {
      type: String,
      required: true
    },
    fundingType: {
      type: String,
      enum: [
        'Private_Equity',
        'Equity_Funding',
        'Debt_Funding',
        'Grants',
        'Convertible_Notes',
        'Revenue_Based_Financing',
        'Scholarship'
      ],
    },
    amount:Number,
    status:{
      type:String,
      enum:["pending", "accepted", "rejected"]
    }
  }],
  requested: [{
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    message: {
      type: String,
      required: true
    },
    fundingType: {
      type: String,
      enum: [
        'Private_Equity',
        'Equity_Funding',
        'Debt_Funding',
        'Grants',
        'Convertible_Notes',
        'Revenue_Based_Financing',
        'Scholarship'
      ],
    },
    amount:{
      type:Number,
    },
    status:{
      type:String,
      enum:["pending", "accepted", "rejected", "transfered"]
    }
  }]

}, { timestamps: true });

const FundingAgency = mongoose.models.FundingAgency || mongoose.model("FundingAgency", fundingAgencySchema);

export default FundingAgency; 