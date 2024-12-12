"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Target, Award, ChevronRight, ChevronLeft, Microscope, GraduationCap, Globe, Search, BookOpen, Landmark, Rocket, FlaskConical } from "lucide-react";
import { useRouter } from "next/navigation";

interface WelcomePopupProps {
  onStartTour: () => void;
}

const steps = [
  {
    title: "Welcome to Gujarat Innovation Platform",
    description: "Your gateway to innovation and entrepreneurship in Gujarat",
    icon: "/gujarat-logo.png",
    color: "from-sky-500 to-blue-600",
    action: {
      label: "Explore Platform",
      route: "/explore"
    }
  },
  {
    title: "Discover Startups",
    description: "Explore innovative startups across various sectors",
    icon: Rocket,
    color: "from-blue-600 to-sky-400",
    stats: { value: "1000+", label: "Active Startups" },
    action: {
      label: "View Startups",
      route: "/startup/projects"
    }
  },
  {
    title: "Funding Opportunities",
    description: "Connect with government and private funding agencies",
    icon: Landmark,
    color: "from-purple-600 to-indigo-400",
    stats: { value: "₹500Cr", label: "Available Funding" },
    action: {
      label: "Browse Funding",
      route: "/explore"
    }
  },
  {
    title: "Research Hub",
    description: "Access latest research papers and academic publications",
    icon: BookOpen,
    color: "from-emerald-600 to-teal-400",
    stats: { value: "10K+", label: "Research Papers" },
    action: {
      label: "Read Research",
      route: "/explore"
    }
  },
  {
    title: "Startup Support",
    description: "Register your startup, get funding, and connect with mentors",
    icon: Building2,
    color: "from-blue-600 to-sky-400",
    stats: { value: "1000+", label: "Startups" },
    action: {
      label: "Register Startup",
      route: "/explore"
    }
  },
  {
    title: "Funding Access",
    description: "Direct access to government schemes and investor network",
    icon: Target,
    color: "from-purple-600 to-indigo-400",
    stats: { value: "₹500Cr", label: "Funding" },
    action: {
      label: "Access Funding",
      route: "/explore"
    }
  },
  {
    title: "Expert Mentorship",
    description: "Learn from industry experts and successful entrepreneurs",
    icon: Users,
    color: "from-emerald-600 to-teal-400",
    stats: { value: "50K+", label: "Community" },
    action: {
      label: "Join Community",
      route: "/"
    }
  },
  {
    title: "IPR Support",
    description: "File patents, trademarks, and get intellectual property guidance",
    icon: Award,
    color: "from-amber-600 to-yellow-400",
    stats: { value: "2000+", label: "Patents Filed" },
    action: {
      label: "File IPR",
      route: "/register/ipr"
    }
  },
 
  {
    title: "Market Access",
    description: "Connect with industry partners and explore indian markets",
    icon: Globe,
    color: "from-indigo-600 to-violet-400",
    stats: { value: "50+", label: "Partner Countries" },
    action: {
      label: "Explore Markets",
      route: "/explore/partner-countries"
    }
  }
];

export function WelcomePopup({ onStartTour }: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleAction = (route: string) => {
    setIsOpen(false);
    router.push(route);
  };

  const handleStartTour = () => {
    setIsOpen(false);
    onStartTour();
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] bg-gradient-to-br from-sky-50 to-white border-sky-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 py-4"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="flex justify-center"
              >
                <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                  {typeof step.icon === 'string' ? (
                    <img 
                      src={step.icon}
                      alt="Icon"
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <step.icon className="h-8 w-8 text-white" />
                  )}
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                  {step.title}
                </h2>
                <p className="text-sky-600 mt-2">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Stats if available */}
            {step.stats && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-sky-50/50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-sky-700">{step.stats.value}</div>
                <div className="text-sm text-sky-600">{step.stats.label}</div>
              </motion.div>
            )}

            {/* Add Action Button if available */}
            {step.action && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <Button
                  onClick={() => handleAction(step.action.route)}
                  className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
                >
                  {step.action.label}
                </Button>
              </motion.div>
            )}

            {/* Progress Dots */}
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-sky-600' : 'bg-sky-200'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-sky-700"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="border-sky-200 text-sky-700 hover:bg-sky-50"
                >
                  Skip 
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleStartTour}
                    className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
                  >
                    Take Tour
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 