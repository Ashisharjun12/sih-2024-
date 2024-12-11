"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, Microscope, Scale, Banknote, Users, Brain, Sparkles, ArrowUpRight, Building2, Lightbulb, Factory } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Chatbot } from "@/components/chatbot/chatbot";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative py-24 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Gujarat-themed Gradient Background */}
        <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-amber-50 to-orange-50" />
        <div className="absolute inset-0 bg-[url('/patterns/gujarat-pattern.png')] opacity-5" />
        
        <div className="container relative px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="inline-block mb-4 px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
              variants={itemVariants}
            >
              ગુજરાત નું ���ૌરવ - Gujarat&apos;s Pride
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-800 via-orange-700 to-orange-800 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Innovate in the Land of Opportunities
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Join Gujarat&apos;s premier innovation platform connecting startups, researchers, and industries. 
              Transform your ideas into reality in India&apos;s most business-friendly state.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              variants={itemVariants}
            >
              <Button 
                size="lg" 
                className="h-12 px-6 gap-2 text-base bg-orange-600 hover:bg-orange-700" 
                asChild
              >
                <Link href="/explore">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-6 gap-2 text-base group border-orange-200 hover:bg-orange-50" 
                asChild
              >
                <Link href="/register">
                  Join Ecosystem
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Key Sectors Section */}
      <motion.section 
        className="py-24 bg-gradient-to-b from-orange-50/50 via-white to-orange-50/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-orange-900">Key Focus Sectors</h2>
            <p className="text-muted-foreground">
              Driving innovation across Gujarat&apos;s most promising sectors
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-amber-50 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <Card className="relative h-full bg-white/60 backdrop-blur-sm border-orange-100 hover:border-orange-200 transition-colors">
                  <CardContent className="p-6">
                    <sector.icon className="h-10 w-10 text-orange-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-orange-900">{sector.title}</h3>
                    <p className="text-muted-foreground">{sector.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section 
        className="py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-transparent to-amber-100/30" />
        <div className="container relative px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-orange-100"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.1 
                }}
              >
                <motion.div 
                  className="text-4xl font-bold mb-2 bg-gradient-to-br from-orange-600 to-orange-800 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-orange-900/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-24 relative overflow-hidden bg-gradient-to-b from-orange-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-orange-900">Why Choose Gujarat?</h2>
            <p className="text-muted-foreground">
              Discover the advantages of building your startup in Gujarat
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="relative h-full border-orange-100 hover:border-orange-200 transition-colors">
                  <CardContent className="p-6">
                    <feature.icon className="h-8 w-8 text-orange-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-orange-900">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500" />
        <div className="absolute inset-0 bg-[url('/patterns/gujarat-pattern.png')] opacity-10" />
        <div className="container relative px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.h2 
              className="text-4xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Begin Your Success Story in Gujarat
            </motion.h2>
            <motion.p
              className="text-xl mb-8 text-white/90"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join the vibrant ecosystem of innovation and growth
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 justify-center"
            >
              <Button 
                size="lg" 
                variant="secondary"
                className="h-12 px-6 gap-2 bg-white text-orange-600 hover:bg-white/90"
                asChild
              >
                <Link href="/register">
                  Get Started Now
                  <Sparkles className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-12 px-6 gap-2 border-white hover:text-white hover:bg-white/10 text-zinc-950"
                asChild
              >
                <Link href="/explore">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Add Chatbot */}
      <Chatbot />
    </div>
  );
}

const sectors = [
  {
    icon: Factory,
    title: "Manufacturing Excellence",
    description: "Leading India's manufacturing revolution with state-of-the-art facilities and skilled workforce.",
  },
  {
    icon: Rocket,
    title: "Technology & Innovation",
    description: "Fostering technological advancement through world-class innovation infrastructure.",
  },
  {
    icon: Building2,
    title: "Smart Cities",
    description: "Pioneering urban development with GIFT City and other smart city initiatives.",
  },
  {
    icon: Microscope,
    title: "Research & Development",
    description: "Home to premier research institutions and innovation centers driving technological advancement.",
  },
  {
    icon: Banknote,
    title: "Financial Hub",
    description: "India's first operational smart fintech city with GIFT City leading financial innovation.",
  },
  {
    icon: Lightbulb,
    title: "Renewable Energy",
    description: "Leading the renewable energy revolution with solar and wind power initiatives.",
  },
];

const features = [
  {
    icon: Building2,
    title: "Strategic Location",
    description: "Access to major ports and international trade routes.",
  },
  {
    icon: Users,
    title: "Skilled Workforce",
    description: "Large pool of skilled professionals and technical experts.",
  },
  {
    icon: Scale,
    title: "Business-Friendly Policies",
    description: "Streamlined regulations and supportive government policies.",
  },
  {
    icon: Brain,
    title: "Innovation Ecosystem",
    description: "Vibrant startup ecosystem with incubators and accelerators.",
  },
  {
    icon: Factory,
    title: "Industrial Infrastructure",
    description: "World-class industrial parks and special economic zones.",
  },
  {
    icon: Banknote,
    title: "Investment Support",
    description: "Attractive incentives and financial support for startups.",
  },
];

const stats = [
  { value: "17.9%", label: "Of India's Industrial Output" },
  { value: "₹19.44L Cr", label: "GSDP (2020-21)" },
  { value: "#1", label: "In Ease of Doing Business" },
  { value: "40+", label: "Industrial Clusters" },
];
