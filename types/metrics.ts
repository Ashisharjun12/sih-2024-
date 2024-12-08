export type MetricKey = 'roi' | 'customerAcquisition' | 'burnRate' | 'revenue' | 'grossMargin';

export type TimeframeKey = 'monthly' | 'yearly';

export interface MetricData {
  value?: number[];
  target?: number[];
  rate?: number[];
  expenses?: number[];
  actual?: number[];
}

export interface MetricsData {
  timeframe: TimeframeKey;
  labels: string[];
  metrics: {
    [K in MetricKey]: MetricData;
  };
  stats: {
    [key: string]: {
      value: number;
      change: number;
    };
  };
  mouStatus: {
    signed: number;
    inProgress: number;
    underReview: number;
    completed: number;
    renewed: number;
  };
  marketAnalysis: {
    currentPerformance: Record<string, number>;
    industryAverage: Record<string, number>;
  };
  revenueStreams: Record<string, number>;
} 