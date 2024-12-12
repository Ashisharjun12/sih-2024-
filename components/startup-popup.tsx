"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Building2, UserCircle, BarChart2, 
  FolderKanban, Calendar, MapPin 
} from "lucide-react";

const steps = [
  {
    title: "Startup Dashboard",
    description: "Your central hub for managing startup activities",
    icon: Building2,
    color: "from-green-500 to-emerald-600",
    stats: { value: "Overview", label: "Startup Management" },
    route: "/startup"
  },
  {
    title: "Profile Management",
    description: "Update and manage your startup profile details",
    icon: UserCircle,
    color: "from-blue-500 to-indigo-600",
    stats: { value: "100%", label: "Profile Completion" },
    route: "/startup/profile"
  },
  {
    title: "Performance Metrics",
    description: "Track your startup's growth and KPIs",
    icon: BarChart2,
    color: "from-purple-500 to-violet-600",
    stats: { value: "15+", label: "Key Metrics" },
    route: "/startup/metrics"
  },
  {
    title: "Project Management",
    description: "Manage your ongoing projects and initiatives",
    icon: FolderKanban,
    color: "from-orange-500 to-red-600",
    stats: { value: "8", label: "Active Projects" },
    route: "/startup/projects"
  },
  {
    title: "Meeting Schedule",
    description: "Schedule and manage your meetings",
    icon: Calendar,
    color: "from-pink-500 to-rose-600",
    stats: { value: "5", label: "Upcoming Meetings" },
    route: "/startup/meetings"
  },
  {
    title: "Offline Events",
    description: "Join workshops and networking events",
    icon: MapPin,
    color: "from-teal-500 to-cyan-600",
    stats: { value: "10+", label: "Monthly Events" },
    route: "/startup/offline"
  }
];

export function StartupPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNavigation = (route: string) => {
    setIsOpen(false);
    router.push(route);
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
      <DialogContent className="sm:max-w-[450px] bg-gradient-to-br from-green-50 to-white border-green-200">
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
                  <step.icon className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  {step.title}
                </h2>
                <p className="text-green-600 mt-2">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50/50 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-green-700">{step.stats.value}</div>
              <div className="text-sm text-green-600">{step.stats.label}</div>
            </motion.div>

            {/* Navigation Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Button
                onClick={() => handleNavigation(step.route)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Explore {step.title}
              </Button>
            </motion.div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-green-600' : 'bg-green-200'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-green-700"
              >
                Previous
              </Button>

              <Button
                variant="ghost"
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="text-green-700"
              >
                Next
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
