import mongoose from 'mongoose';

// Interface for reviews
interface IReview {
    reviewer: mongoose.Types.ObjectId;
    reviewerType: 'Startup' | 'Researcher' | 'FundingAgency';
    message: string;
    createdAt: Date;
}

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'reviewerType'
    },
    reviewerType: {
        type: String,
        required: true,
        enum: ['Startup', 'Researcher', 'FundingAgency']
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true });

const policySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    vision: {
        type: String,
        required: true
    },
    objectives: {
        type: [String],
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
    reviews: [reviewSchema],
    metrics: {
        totalReviews: {
            type: Number,
            default: 0
        },
        startupReviews: {
            type: Number,
            default: 0
        },
        researcherReviews: {
            type: Number,
            default: 0
        },
        fundingAgencyReviews: {
            type: Number,
            default: 0
        }
    },
    documents: [{
        public_id: String,
        secure_url: String
    }]
}, { timestamps: true });

// Pre-save middleware to update metrics
policySchema.pre('save', function (next) {
    if (this.reviews?.length > 0) {
        // Update total reviews
        this.metrics.totalReviews = this.reviews.length;

        // Count reviews by type
        this.metrics.startupReviews = this.reviews.filter(
            review => review.reviewerType === 'Startup'
        ).length;

        this.metrics.researcherReviews = this.reviews.filter(
            review => review.reviewerType === 'Researcher'
        ).length;

        this.metrics.fundingAgencyReviews = this.reviews.filter(
            review => review.reviewerType === 'FundingAgency'
        )
    }
    next();
});

// Method to add a review
policySchema.methods.addReview = async function (reviewData: IReview) {
    // Check if user has already reviewed
    const existingReview = this.reviews.find(
        review => review.reviewer.toString() === reviewData.reviewer.toString()
    );

    if (existingReview) {
        throw new Error('User has already reviewed this policy');
    }

    this.reviews.push(reviewData);
    await this.save();
    return this;
};

// Method to get reviews by type
policySchema.methods.getReviewsByType = function (type: 'Startup' | 'Researcher' | 'FundingAgency') {
    return this.reviews.filter(review => review.reviewerType === type);
};

const Policy = mongoose.models.Policy || mongoose.model('Policy', policySchema);

export default Policy; 