"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
        className="py-20 bg-gradient-to-b from-background to-muted"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-5xl font-bold tracking-tight mb-6"
              variants={itemVariants}
            >
              Connect, Innovate, and Grow with StartupHub
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              variants={itemVariants}
            >
              Your one-stop platform for startups, researchers, and innovators to collaborate and thrive together.
            </motion.p>
            <motion.div 
              className="flex gap-4 justify-center"
              variants={itemVariants}
            >
              <Button size="lg" asChild>
                <Link href="/explore">Explore Platform</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Register Your Startup</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section 
        className="py-16 bg-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.1 
                }}
              >
                <motion.div 
                  className="text-4xl font-bold mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-20 bg-primary text-primary-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              size="lg" 
              variant="secondary"
              asChild
            >
              <Link href="/register">Get Started Now</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

const features = [
  {
    title: "Startup Ecosystem",
    description: "Connect with investors, mentors, and fellow entrepreneurs to grow your startup.",
  },
  {
    title: "Research Collaboration",
    description: "Bridge the gap between academia and industry through meaningful collaborations.",
  },
  {
    title: "Innovation Hub",
    description: "Access resources, tools, and expertise to drive innovation in your field.",
  },
];

const stats = [
  { value: "500+", label: "Startups" },
  { value: "1000+", label: "Researchers" },
  { value: "₹50M+", label: "Funding Facilitated" },
  { value: "200+", label: "Success Stories" },
];
