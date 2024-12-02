export interface StartupDetails {
  name: string;
  sector: string;
  founded: number;
  employees: number;
  funding: string;
  revenue?: string;
  website?: string;
  stage: 'Seed' | 'Early' | 'Growth' | 'Mature';
  keyProducts: string[];
  achievements?: string[];
}

export interface StartupHub {
  id: number;
  name: string;
  city: string;
  coordinates: { lat: number; lng: number };
  sector: string;
  startupCount: number;
  funding: string;
  growth: string;
  description: string;
  totalEmployees: string;
  foundedYear: number;
  facilities: string[];
  amenities: string[];
  keyPartners: string[];
  startups: StartupDetails[];
  metrics: {
    successRate: string;
    avgValuation: string;
    jobsCreated: string;
    patentsFiled: number;
  };
}

export const gujaratStartups: StartupHub[] = [
  {
    id: 1,
    name: "TechHub Ahmedabad",
    city: "Ahmedabad",
    coordinates: { lat: 23.0225, lng: 72.5714 },
    sector: "Technology",
    startupCount: 150,
    funding: "₹50Cr",
    growth: "+45%",
    description: "Leading technology innovation hub in Gujarat",
    totalEmployees: "2000+",
    foundedYear: 2019,
    facilities: [
      "Co-working Space",
      "Innovation Lab",
      "Conference Rooms",
      "High-speed Internet"
    ],
    amenities: [
      "24/7 Access",
      "Cafeteria",
      "Recreation Area",
      "Parking"
    ],
    keyPartners: [
      "IIM Ahmedabad",
      "Gujarat Technical University",
      "TiE Ahmedabad"
    ],
    startups: [
      {
        name: "InnoTech Solutions",
        sector: "AI/ML",
        founded: 2021,
        employees: 120,
        funding: "₹5Cr",
        stage: "Growth",
        keyProducts: ["AI Analytics Platform", "ML Solutions"],
        achievements: ["Best AI Startup 2022", "ISO 27001 Certified"],
        revenue: "₹2Cr/year",
        website: "www.innotech.com"
      },
      {
        name: "CloudBurst",
        sector: "Cloud Computing",
        founded: 2022,
        employees: 80,
        funding: "₹3Cr",
        stage: "Early",
        keyProducts: ["Cloud Management Tool", "DevOps Platform"],
        website: "www.cloudburst.tech"
      }
    ],
    metrics: {
      successRate: "75%",
      avgValuation: "₹10Cr",
      jobsCreated: "2000+",
      patentsFiled: 15
    }
  },
  {
    id: 2,
    name: "GIFT City FinHub",
    city: "GIFT City",
    coordinates: { lat: 23.1620, lng: 72.6841 },
    sector: "FinTech",
    startupCount: 80,
    funding: "₹75Cr",
    growth: "+60%",
    description: "India's premier fintech innovation center",
    totalEmployees: "1500+",
    foundedYear: 2020,
    facilities: [
      "Trading Floor",
      "Blockchain Lab",
      "Data Center",
      "Research Wing"
    ],
    amenities: [
      "Bloomberg Terminals",
      "Financial Library",
      "Meeting Rooms",
      "Training Center"
    ],
    keyPartners: [
      "NSE",
      "World Bank",
      "State Bank of India"
    ],
    startups: [
      {
        name: "FinSecure",
        sector: "Cybersecurity",
        founded: 2022,
        employees: 100,
        funding: "₹8Cr",
        stage: "Growth",
        keyProducts: ["Fraud Detection System", "Secure Payment Gateway"],
        achievements: ["NASSCOM Fintech Award", "ISO 27001"],
        revenue: "₹4Cr/year",
        website: "www.finsecure.in"
      }
    ],
    metrics: {
      successRate: "80%",
      avgValuation: "₹15Cr",
      jobsCreated: "1500+",
      patentsFiled: 10
    }
  },
  {
    id: 7,
    name: "Mehsana Industrial Hub",
    city: "Mehsana",
    coordinates: { lat: 23.5880, lng: 72.3693 },
    sector: "Manufacturing & Engineering",
    startupCount: 60,
    funding: "₹25Cr",
    growth: "+28%",
    description: "Industrial manufacturing and engineering innovation center",
    totalEmployees: "800+",
    foundedYear: 2020,
    facilities: [
      "Manufacturing Units",
      "Testing Labs",
      "R&D Center",
      "Training Facility"
    ],
    amenities: [
      "Industrial Workshop",
      "Quality Control Lab",
      "Conference Hall",
      "Cafeteria"
    ],
    keyPartners: [
      "Gujarat Industrial Development Corporation",
      "L&T Technology Services",
      "Mehsana Industries Association"
    ],
    startups: [
      {
        name: "SmartFactory Solutions",
        sector: "Industry 4.0",
        founded: 2021,
        employees: 45,
        funding: "₹3Cr",
        stage: "Early",
        keyProducts: ["Smart Factory Platform", "IoT Solutions"],
        website: "www.smartfactory.in"
      }
    ],
    metrics: {
      successRate: "70%",
      avgValuation: "₹8Cr",
      jobsCreated: "800+",
      patentsFiled: 8
    }
  },
  {
    id: 8,
    name: "Bhavnagar Maritime Tech",
    city: "Bhavnagar",
    coordinates: { lat: 21.7645, lng: 72.1519 },
    sector: "Maritime & Shipping",
    startupCount: 40,
    funding: "₹20Cr",
    growth: "+25%",
    description: "Maritime technology and shipping innovation hub",
    totalEmployees: "600+",
    foundedYear: 2021,
    facilities: [
      "Ship Design Center",
      "Maritime Lab",
      "Simulation Center",
      "Research Wing"
    ],
    amenities: [
      "Training Center",
      "Conference Room",
      "Digital Library",
      "Recreation Area"
    ],
    keyPartners: [
      "Gujarat Maritime Board",
      "Alang Ship Recycling Yard",
      "Marine Engineering College"
    ],
    startups: [
      {
        name: "ShipTech Innovations",
        sector: "Maritime Tech",
        founded: 2022,
        employees: 35,
        funding: "₹2.5Cr",
        stage: "Seed",
        keyProducts: ["Ship Management Software", "Maritime IoT"],
        website: "www.shiptech.co.in"
      }
    ],
    metrics: {
      successRate: "65%",
      avgValuation: "₹6Cr",
      jobsCreated: "600+",
      patentsFiled: 5
    }
  },
  {
    id: 9,
    name: "Anand AgriTech Valley",
    city: "Anand",
    coordinates: { lat: 22.5645, lng: 72.9289 },
    sector: "Agriculture Technology",
    startupCount: 55,
    funding: "₹30Cr",
    growth: "+35%",
    description: "Agricultural technology and dairy innovation center",
    totalEmployees: "750+",
    foundedYear: 2020,
    facilities: [
      "AgriTech Lab",
      "Dairy Innovation Center",
      "Field Testing Area",
      "Research Facility"
    ],
    amenities: [
      "Smart Greenhouse",
      "Meeting Rooms",
      "Training Center",
      "Product Testing Lab"
    ],
    keyPartners: [
      "Amul",
      "Anand Agricultural University",
      "ICAR"
    ],
    startups: [
      {
        name: "FarmTech Solutions",
        sector: "AgriTech",
        founded: 2021,
        employees: 40,
        funding: "₹4Cr",
        stage: "Growth",
        keyProducts: ["Smart Farming Platform", "Crop Analysis Tools"],
        website: "www.farmtech.in"
      }
    ],
    metrics: {
      successRate: "75%",
      avgValuation: "₹7Cr",
      jobsCreated: "750+",
      patentsFiled: 6
    }
  }
  // Add more hubs as needed...
]; 