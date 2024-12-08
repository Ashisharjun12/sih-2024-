"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StartupMetrics } from "@/components/metrics/startup-metrics";

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  startupId: string;
}

export function MetricsModal({ isOpen, onClose, startupId }: MetricsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] w-[1200px] h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Startup Analytics</DialogTitle>
        </DialogHeader>
        <StartupMetrics startupId={startupId} />
      </DialogContent>
    </Dialog>
  );
} 