"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Building2,
  Users,
  Target,
  Award,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  Play,
} from "lucide-react";
import Image from "next/image";
import { Chatbot } from "@/components/chatbot/chatbot";
import { createTourDriver } from "@/lib/driver/config";
import "driver.js/dist/driver.css";
import { driverStyles } from "@/lib/driver/styles";
import { useEffect } from "react";
import { WelcomePopup } from "@/components/welcome-popup";


const ACHIEVEMENTS = [
  {
    icon: Building2,
    stat: "1000+",
    label: "Startups",
    description: "Registered from Gujarat"
  },
  {
    icon: Users,
    stat: "50,000+",
    label: "Innovators",
    description: "Active community members"
  },
  {
    icon: Target,
    stat: "₹500Cr",
    label: "Funding",
    description: "Total funding raised"
  },
  {
    icon: Award,
    stat: "200+",
    label: "Success Stories",
    description: "From idea to reality"
  }
];

const STARTUP_ACHIEVEMENTS = [
  {
    logo: "https://cloud.appwrite.io/v1/storage/buckets/6751f5b2001b866143e5/files/675ab75b000745931acf/view?project=6751f4b40018a3ea8247&project=6751f4b40018a3ea8247&mode=admin",
    name: "Blink Out",
    industries: ["Robotics Technology", "AI"],
    sectors: ["Electronics"],
    stage: "Ideation",
    joinedToFunding: "25 days"
  },
  {
    logo: "https://cloud.appwrite.io/v1/storage/buckets/6751f5b2001b866143e5/files/675ab75c0019987dba73/view?project=6751f4b40018a3ea8247&project=6751f4b40018a3ea8247&mode=admin",
    name: "Future Robotics",
    industries: ["Robotics", "AI"],
    sectors: ["Robotics Technology", "Machine Learning", "Automation"],
    stage: "Validation",
    joinedToFunding: "50 days"
  },
  {
    logo: "https://cloud.appwrite.io/v1/storage/buckets/6751f5b2001b866143e5/files/675ab75d000ec3144c0f/view?project=6751f4b40018a3ea8247&project=6751f4b40018a3ea8247&mode=admin",
    name: "HealthTech Innovations",
    industries: ["Healthcare & Lifesciences", "AI"],
    sectors: ["Healthcare Technology", "Medical Devices Biomedical", "Data Science"],
    stage: "Validation",
    joinedToFunding: "100 days"
  },
  {
    logo: "https://cloud.appwrite.io/v1/storage/buckets/6751f5b2001b866143e5/files/675ab75e0009897f8bef/view?project=6751f4b40018a3ea8247&project=6751f4b40018a3ea8247&mode=admin",
    name: "GreenFuture",
    industries: ["Green Technology", "Renewable Energy"],
    sectors: ["Renewable Solar Energy", "Environmental Services & Equipment", "Clean Tech"],
    stage: "Validation",
    joinedToFunding: "35 days"
  }
]

const FOOTER_LINKS = {
  platform: [
    { label: "About Us", href: "#" },
    { label: "Features", href: "#" },
    { label: "Success Stories", href: "#" },
    { label: "Latest News", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "Blog", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Disclaimer", href: "#" },
  ]
};

const AchievementCard = ({ icon, number, title }: {
  icon: string;
  number: string;
  title: string;
}) => {
  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <Image 
          src={icon}
          alt={title}
          width={48}
          height={48}
        />
      </div>
      <h3 className="text-3xl font-bold text-primary mb-2">{number}</h3>
      <p className="text-gray-600 text-center">{title}</p>
    </div>
  )
}

export default function HomePage() {
  useEffect(() => {
    // Add custom styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = driverStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const startTour = () => {
    const driverObj = createTourDriver();
    driverObj.drive();
  };

  return (
    <div className="flex flex-col">
      <WelcomePopup onStartTour={startTour} />
      
      {/* Hero Section */}
      <div className="relative min-h-[90vh]  bg-gradient-to-br from-sky-950 via-sky-900 to-blue-900">
        {/* Gujarat Map Overlay */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/gujarat-map.svg"
            alt="Gujarat Map"
            fill
            className="object-contain opacity-20"
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10 h-[90vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Badge className="bg-sky-400/10 text-sky-200 border-sky-400/30 px-4 py-2">
                ગુજરાત સરકાર | Government of Gujarat
              </Badge>

              <h1 className="text-6xl font-bold leading-tight">
                <span className="text-white">Building</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300">
                  {" "}Gujarat's{" "}
                </span>
                <span className="text-white">Innovation Future</span>
              </h1>

              <p className="text-xl text-sky-200 leading-relaxed max-w-xl">
                Join Gujarat's premier platform for innovation and entrepreneurship.
                Where tradition meets technology to create tomorrow's success stories.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-6 text-lg rounded-xl 
                    transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-sky-500/25"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

              </div>
            </motion.div>

            {/* Right Side - Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative hidden lg:block"
            >
              <div className="relative bg-gradient-to-br from-sky-900/50 to-blue-900/50 rounded-2xl 
                backdrop-blur-sm border border-sky-500/20 p-8 ">
                <Image
                  src="/startu.png"
                  alt="Gujarat Startup Ecosystem"
                  width={600}
                  height={400}
                  className="rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {ACHIEVEMENTS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="mb-4 inline-block p-4 rounded-2xl bg-sky-50 group-hover:bg-sky-100 transition-colors">
                  <item.icon className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{item.stat}</h3>
                <p className="text-lg font-semibold text-gray-800 mb-1">{item.label}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Startup Achievements Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2 mb-4">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl text-white font-extrabold mb-6">Our Achievements</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Discover innovative startups that have grown through our platform
            </p>
          </motion.div>
=======
      {/* Startup Achievements*/}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-white font-extrabold text-center mb-12">Our Achievements</h2>
>>>>>>> 25e1f820774dd3760ad347538056ef7b497fe00f

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STARTUP_ACHIEVEMENTS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
<<<<<<< HEAD
                className="group"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl 
                  transform hover:scale-102 transition-all duration-300 overflow-hidden border border-white/20">
                  <div className="p-6">
                    {/* Logo Section */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-blue-50 rounded-2xl 
                        transform -rotate-6 scale-90 opacity-50" />
                      <div className="relative w-20 h-20 mx-auto bg-white rounded-2xl p-3 shadow-md">
                        <img 
                          src={item.logo} 
                          alt={item.name} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-4 group-hover:text-blue-600 
                      transition-colors">
                      {item.name}
                    </h3>

                    {/* Industries Section */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="font-medium">Industries</span>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          {item.industries.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.industries.map((industry, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="bg-blue-50/50 text-blue-700 border-blue-100 hover:bg-blue-100 
                              transition-colors text-xs"
                          >
=======
                className="group transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  <div className="p-6 bg-sky-50">
                    <img src={item.logo} alt={item.name} className="w-20 h-20 mx-auto mb-4 object-contain" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{item.name}</h3>

                    {/* Badges for Industries */}
                    <div className="mb-2">
                      <strong>Industries:</strong>
                      <div className="flex space-x-2 mt-2">
                        {item.industries.map((industry, idx) => (
                          <Badge key={idx} variant="outline" color="sky" className="text-xs font-medium">
>>>>>>> 25e1f820774dd3760ad347538056ef7b497fe00f
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>

<<<<<<< HEAD
                    {/* Sectors Section */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="font-medium">Sectors</span>
                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                          {item.sectors.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.sectors.map((sector, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline"
                            className="bg-emerald-50/50 text-emerald-700 border-emerald-100 
                              hover:bg-emerald-100 transition-colors text-xs"
                          >
=======
                    {/* Badges for Sectors */}
                    <div className="mb-2">
                      <strong>Sectors:</strong>
                      <div className="flex space-x-2 mt-2">
                        {item.sectors.map((sector, idx) => (
                          <Badge key={idx} variant="outline" color="green" className="text-xs font-medium">
>>>>>>> 25e1f820774dd3760ad347538056ef7b497fe00f
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>

<<<<<<< HEAD
                    {/* Info Section */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <div className="text-xs font-medium text-gray-500 mb-1">Stage</div>
                        <div className="text-sm font-semibold text-gray-900">{item.stage}</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <div className="text-xs font-medium text-gray-500 mb-1">Time to Funding</div>
                        <div className="text-sm font-semibold text-gray-900">{item.joinedToFunding}</div>
                      </div>
                    </div>
=======
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Stage:</strong> {item.stage}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Joined to Funding:</strong> {item.joinedToFunding}
                    </p>
>>>>>>> 25e1f820774dd3760ad347538056ef7b497fe00f
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


      {/* Video Section */}
      <div id="video-section" className="bg-sky-950 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="bg-sky-900 text-sky-200 mb-4">
              Our Vision
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-6">
              Building Tomorrow's Gujarat
            </h2>
            <p className="text-sky-200 text-lg">
              Watch how we're transforming Gujarat into India's innovation capital
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/lH2AFRvImGc?si=VKS5AvoN8d7hFnHE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              size="lg"
              className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-6 text-lg rounded-xl"
            >
              Explore More Stories
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full blur 
            opacity-75 group-hover:opacity-100 transition duration-300" />
          <Chatbot pageContext="home" />
        </motion.div>
      </div>

      {/* Footer Section */}
      <footer className="bg-sky-950 text-sky-200">
        <div className="container mx-auto px-4 py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/gujarat-logo.png" // Add your logo
                  alt="Gujarat Innovation Platform"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
                <h3 className="text-xl font-bold text-white">Gujarat Innovation</h3>
              </div>
              <p className="text-sky-300">
                Empowering innovators and entrepreneurs to build a brighter future for Gujarat.
              </p>

            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.platform.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sky-300 hover:text-sky-100 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.resources.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sky-300 hover:text-sky-100 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <span>Gandhinagar, Gujarat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-sky-400" />
                  <a href="mailto:contact@gujaratinnovation.gov.in"
                    className="hover:text-sky-100 transition-colors">
                    contact@gujaratinnovation.gov.in
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-sky-400" />
                  <a href="tel:+91-79-23243471"
                    className="hover:text-sky-100 transition-colors">
                    +91-79-23243471
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-sky-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sky-400">
                © 2024 Gujarat Innovation Platform. All rights reserved.
              </div>
              <div className="flex gap-6">
                {FOOTER_LINKS.legal.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sky-400 hover:text-sky-300 text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Add tour button */}
      <Button
        onClick={startTour}
        className="fixed bottom-24 right-6 z-50 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
        size="icon"
        title="Start Tour"
      >
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
}
