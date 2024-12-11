"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Rocket,
  Target,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Play,
  ChevronRight,
  Shield,
  Network,
  Database,
  Globe,
  Zap,
  LineChart,
  Cpu,
  Binary,
  Cloud,
} from "lucide-react";
import Image from "next/image";
import { Chatbot } from "@/components/chatbot/chatbot";

const SUCCESS_STORIES = [
  {
    name: "ટેક ઇનોવેશન્સ | Tech Innovations",
    description: "ગુજરાતની પ્રથમ AI લેબમાંથી ₹50Cr વેલ્યુએશન સુધીની સફર",
    englishDesc: "Journey from Gujarat's first AI lab to ₹50Cr valuation",
    funding: "₹8.5Cr",
    image: "/success1.jpg",
    tag: "AI & Healthcare"
  },
  {
    name: "ગ્રીન એનર્જી | Green Energy",
    description: "ગુજરાત સરકાર સાથે ₹15Cr નો પ્રોજેક્ટ",
    englishDesc: "₹15Cr project with Gujarat Government",
    funding: "₹12Cr",
    image: "/success2.jpg",
    tag: "CleanTech"
  },
  {
    name: "બાયોટેક સોલ્યુશન્સ | BioTech",
    description: "5 રિસર્ચ ઇન્સ્ટિટ્યૂટ્સ સાથે સફળ સહયોગ",
    englishDesc: "Successful collaboration with 5 research institutes",
    funding: "₹15Cr",
    image: "/success3.jpg",
    tag: "BioTech"
  }
];

const PLATFORM_STATS = [
  {
    title: "ગુરાતી સ્ટાર્ટઅપ્સ",
    englishTitle: "Gujarat Startups",
    value: "1000+",
    icon: Rocket,
    color: "text-orange-600"
  },
  {
    title: "કુલ ફંડિંગ",
    englishTitle: "Total Funding",
    value: "₹250Cr+",
    icon: TrendingUp,
    color: "text-orange-600"
  },
  {
    title: "સફળતા દર",
    englishTitle: "Success Rate",
    value: "92%",
    icon: Target,
    color: "text-orange-600"
  },
  {
    title: "રિસર્ચ કોલાબોરેશન",
    englishTitle: "Research Projects",
    value: "2000+",
    icon: BookOpen,
    color: "text-orange-600"
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Enhanced Hero Section with Data Visualization */}
      <div className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-orange-950 via-orange-900 to-orange-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/gujarat-pattern.svg')] opacity-10" />
          
          {/* Floating Network Elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-20 left-[20%] text-orange-400/30"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Network className="h-24 w-24" />
            </motion.div>
            
            <motion.div
              className="absolute top-40 right-[15%] text-orange-400/20"
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <Database className="h-16 w-16" />
            </motion.div>

            <motion.div
              className="absolute bottom-32 left-[30%] text-orange-400/25"
              animate={{
                x: [0, 20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Globe className="h-20 w-20" />
            </motion.div>

            {/* Data Flow Lines */}
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-10">
                <motion.path
                  d="M0 100 Q 250 200 500 100 T 1000 100"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-orange-400"
                  animate={{
                    d: [
                      "M0 100 Q 250 200 500 100 T 1000 100",
                      "M0 150 Q 250 50 500 150 T 1000 150",
                      "M0 100 Q 250 200 500 100 T 1000 100",
                    ],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-orange-950/90 via-orange-900/80 to-orange-800/70" />
        </div>

        {/* Main Content */}
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Badge className="bg-white/10 text-orange-200 border-orange-400/30 backdrop-blur-sm">
                ગુજરાતનું નંબર 1 ઇનોવેશન પ્લેટફોર્મ | Gujarat's #1 Innovation Platform
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-white">ગુજરાતમાં તમારું</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                  {" "}ભવિષ્ય બનાવો
                </span>
              </h1>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">50+</p>
                      <p className="text-orange-200 text-sm">Active Startups</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <LineChart className="h-8 w-8 text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">₹100Cr+</p>
                      <p className="text-orange-200 text-sm">Total Funding</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-500 text-white text-lg px-8 py-6 shadow-lg shadow-orange-900/20"
                >
                  અભી જોડાઓ | Join Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-orange-200 border-orange-400/30 hover:bg-orange-800/50 text-lg px-8 py-6 backdrop-blur-sm"
                >
                  સફળ કહાનીઓ | Success Stories
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Right Side Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-400/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
                <Image
                  src="/startup-dashboard.png"
                  alt="Platform Dashboard"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-2xl border border-orange-400/20 backdrop-blur-sm"
                />
                
                {/* Floating Tech Icons */}
                <motion.div
                  className="absolute -top-10 right-20 bg-white/10 backdrop-blur-md p-3 rounded-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Cpu className="h-6 w-6 text-orange-400" />
                </motion.div>
                <motion.div
                  className="absolute top-20 -right-10 bg-white/10 backdrop-blur-md p-3 rounded-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Binary className="h-6 w-6 text-orange-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-10 left-20 bg-white/10 backdrop-blur-md p-3 rounded-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Cloud className="h-6 w-6 text-orange-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats with Orange Theme */}
      <div className="bg-gradient-to-br from-orange-50 to-white py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {PLATFORM_STATS.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-orange-950">{stat.value}</h3>
                <p className="text-orange-600 font-medium mt-2">{stat.title}</p>
                <p className="text-sm text-orange-500">{stat.englishTitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories with Orange Theme */}
      <div className="bg-gradient-to-br from-white to-orange-50 py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 mb-4">
              સફળ કહાનીઓ | Success Stories
            </Badge>
            <h2 className="text-4xl font-bold text-orange-950 mb-4">
              ગુજરાતના ઇનોવેશન લીડર્સ
            </h2>
            <p className="text-orange-600 max-w-2xl mx-auto text-lg">
              Gujarat's Innovation Leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-48">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/50 text-white backdrop-blur-sm">
                        {story.tag}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{story.name}</h3>
                    <p className="text-gray-600 mb-4">{story.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Funding: {story.funding}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Read More <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section with Orange Theme */}
      <div className="bg-orange-950 py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-orange-900 text-orange-200 border-orange-700">
                પ્લેટફોર્મ ઓવરવ્યૂ | Platform Overview
              </Badge>
              <h2 className="text-4xl font-bold text-white leading-tight">
                ગુજરાતના ઇનોવેશન ભવિષ્યનું નિર્માણ
                <span className="block text-2xl mt-2 text-orange-200">
                  Building Gujarat's Innovation Future
                </span>
              </h2>
              <p className="text-xl text-blue-200 leading-relaxed">
                Discover how startups are leveraging our platform to connect with researchers,
                secure funding, and scale their innovations across Gujarat and beyond.
              </p>
              <Button 
                size="lg"
                className="bg-white text-blue-950 hover:bg-blue-50 text-lg px-8 py-6"
              >
                Join the Ecosystem
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-900/50">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/your-video-id"
                title="Gujarat Innovation Ecosystem"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Orange Theme */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 py-20">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            તમારી ઇનોવેશન જર્ની શરૂ કરો
            <span className="block text-2xl mt-2">
              Start Your Innovation Journey
            </span>
          </h2>
          <Button 
            size="lg" 
            className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-12 py-6"
          >
            અરજી કરો | Apply Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Add Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot pageContext="home" />
      </div>
    </div>
  );
}
