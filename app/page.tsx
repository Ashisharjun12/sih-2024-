"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Play,
  ChevronRight,
  Star,
  Building2,
  Users,
  Target,
  Award,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { Chatbot } from "@/components/chatbot/chatbot";

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

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] bg-gradient-to-br from-sky-950 via-sky-900 to-blue-900">
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
                 src="https://www.youtube.com/embed/PXrRbGNoBns?si=TW6dihFquN1pIFyr" 
                title="Gujarat Innovation Initiative"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
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
                  width={40}
                  height={40}
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
    </div>
  );
}
