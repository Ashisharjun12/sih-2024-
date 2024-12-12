import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AchievementCardProps {
  icon: LucideIcon;
  stat: string;
  label: string;
  description: string;
  index: number;
}

const AchievementCard = ({ icon: Icon, stat, label, description, index }: AchievementCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div className="p-8 rounded-3xl bg-white border border-sky-100 shadow-lg hover:shadow-xl 
        transition-all duration-300 hover:translate-y-[-2px]">
        <div className="mb-6 inline-flex p-4 rounded-2xl bg-sky-50 group-hover:bg-sky-100 
          transition-colors">
          <Icon className="h-8 w-8 text-sky-600" />
        </div>
        <h3 className="text-4xl font-bold text-gray-900 mb-3">{stat}</h3>
        <p className="text-lg font-semibold text-sky-600 mb-2">{label}</p>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default AchievementCard; 