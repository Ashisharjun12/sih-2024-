import { MetricData } from "./metrics";
import { TimeframeKey } from "./metrics";
import { ReactNode } from "react";
import { ComponentType } from "react";

export interface ChartConfigItem {
  label: string;
  color: string;
  format: (value: number) => string;
  icon?: ComponentType;
  theme?: string;
}

export interface ChartConfig {
  [key: string]: ChartConfigItem;
}

export interface ChartProps {
  data?: MetricData;
  timeFrame?: TimeframeKey;
  labels?: string[];
  onTimeFrameChange?: (timeFrame: TimeframeKey) => void;
} 