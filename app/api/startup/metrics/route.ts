import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MetricKey, TimeframeKey, MetricsData, MetricData } from "@/types/metrics";
import Startup from "@/models/startup.model";

type MetricsDataStore = {
  [K in TimeframeKey]: {
    metrics: {
      [M in MetricKey]: MetricData;
    };
  }
} & {
  stats: MetricsData['stats'];
  mouStatus: MetricsData['mouStatus'];
  marketAnalysis: MetricsData['marketAnalysis'];
  revenueStreams: MetricsData['revenueStreams'];
};

// Sample data for different startups
const STARTUP_METRICS: MetricsDataStore[] = [
  // High-growth startup
  {
    monthly: {
      metrics: {
        roi: {
          value: [20.5, 21.8, 22.5, 23.2, 24.8, 25.5, 26.1, 27.4, 28.8, 29.2, 30.5, 31.0],
          target: [20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0]
        },
        customerAcquisition: {
          value: [120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285],
          target: [110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275]
        },
        burnRate: {
          value: [2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4],
          target: [2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5]
        },
        revenue: {
          value: [200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420],
          expenses: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260]
        },
        grossMargin: {
          value: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76],
          target: [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75]
        }
      }
    },
    yearly: {
      metrics: {
        roi: {
          value: [15.0, 20.0, 25.0, 28.0, 31.0],
          target: [14.0, 19.0, 24.0, 27.0, 30.0]
        },
        customerAcquisition: {
          value: [500, 1000, 1500, 2000, 2500],
          target: [450, 950, 1450, 1950, 2450]
        },
        burnRate: {
          value: [4.0, 3.5, 3.0, 2.5, 2.0],
          target: [4.1, 3.6, 3.1, 2.6, 2.1]
        },
        revenue: {
          value: [1500, 2000, 2500, 3000, 3500],
          expenses: [1000, 1300, 1600, 1900, 2200]
        },
        grossMargin: {
          value: [60, 63, 66, 69, 72],
          target: [59, 62, 65, 68, 71]
        }
      }
    },
    stats: {
      ebitda: { value: 12.0, change: 20 },
      burnRate: { value: 2.0, change: -15 },
      car: { value: 150, change: 25 },
      churnRate: { value: 1.8, change: -0.8 },
      grossMargin: { value: 72, change: 8 },
      growthRate: { value: 35, change: 10 }
    },
    mouStatus: {
      signed: 20,
      inProgress: 12,
      underReview: 8,
      completed: 25,
      renewed: 15
    },
    marketAnalysis: {
      currentPerformance: {
        marketShare: 85,
        growthRate: 92,
        customerSatisfaction: 95,
        innovationIndex: 90,
        brandValue: 80,
        competitiveEdge: 93
      },
      industryAverage: {
        marketShare: 70,
        growthRate: 75,
        customerSatisfaction: 80,
        innovationIndex: 73,
        brandValue: 77,
        competitiveEdge: 75
      }
    },
    revenueStreams: {
      productSales: 40,
      services: 30,
      subscriptions: 25,
      licensing: 15,
      partnerships: 10
    }
  },

  // Early-stage startup
  {
    monthly: {
      metrics: {
        roi: {
          value: [5.2, 5.8, 6.5, 7.2, 7.8, 8.5, 9.1, 9.4, 9.8, 10.2, 10.5, 11.0],
          target: [5.0, 6.0, 7.0, 8.0, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5]
        },
        customerAcquisition: {
          value: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
          target: [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
        },
        burnRate: {
          value: [4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4],
          target: [4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5]
        },
        revenue: {
          value: [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135],
          expenses: [60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93]
        },
        grossMargin: {
          value: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56],
          target: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]
        }
      }
    },
    yearly: {
      metrics: {
        roi: {
          value: [3.0, 5.0, 7.0, 9.0, 11.0],
          target: [2.5, 4.5, 6.5, 8.5, 10.5]
        },
        customerAcquisition: {
          value: [200, 400, 600, 800, 1000],
          target: [180, 380, 580, 780, 980]
        },
        burnRate: {
          value: [5.0, 4.5, 4.0, 3.5, 3.0],
          target: [5.1, 4.6, 4.1, 3.6, 3.1]
        },
        revenue: {
          value: [500, 750, 1000, 1250, 1500],
          expenses: [400, 600, 800, 1000, 1200]
        },
        grossMargin: {
          value: [40, 43, 46, 49, 52],
          target: [39, 42, 45, 48, 51]
        }
      }
    },
    stats: {
      ebitda: { value: 5.0, change: 10 },
      burnRate: { value: 3.5, change: -5 },
      car: { value: 80, change: 15 },
      churnRate: { value: 2.8, change: -0.3 },
      grossMargin: { value: 52, change: 4 },
      growthRate: { value: 20, change: 5 }
    },
    mouStatus: {
      signed: 8,
      inProgress: 5,
      underReview: 3,
      completed: 10,
      renewed: 6
    },
    marketAnalysis: {
      currentPerformance: {
        marketShare: 45,
        growthRate: 62,
        customerSatisfaction: 75,
        innovationIndex: 70,
        brandValue: 50,
        competitiveEdge: 63
      },
      industryAverage: {
        marketShare: 60,
        growthRate: 65,
        customerSatisfaction: 70,
        innovationIndex: 63,
        brandValue: 67,
        competitiveEdge: 65
      }
    },
    revenueStreams: {
      productSales: 25,
      services: 20,
      subscriptions: 15,
      licensing: 8,
      partnerships: 5
    }
  },

  // Default/Demo data
  {
    monthly: {
      metrics: {
        roi: {
          value: [15.2, 16.8, 17.5, 18.2, 19.8, 21.5, 22.1, 23.4, 24.8, 25.2, 26.5, 28.0],
          target: [15.0, 16.5, 18.0, 19.5, 21.0, 22.5, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0]
        },
        customerAcquisition: {
          value: [85, 92, 88, 95, 105, 115, 125, 135, 142, 148, 155, 165],
          target: [80, 85, 90, 92, 95, 100, 105, 110, 115, 120, 125, 130]
        },
        burnRate: {
          value: [3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9],
          target: [3.1, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0]
        },
        revenue: {
          value: [150, 170, 190, 220, 240, 260, 280, 300, 320, 350, 380, 400],
          expenses: [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230]
        },
        grossMargin: {
          value: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
          target: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70]
        }
      }
    },
    yearly: {
      metrics: {
        roi: {
          value: [12.5, 15.8, 19.2, 23.5, 28.0],
          target: [12.0, 15.0, 18.0, 22.0, 27.0]
        },
        customerAcquisition: {
          value: [450, 750, 1200, 1800, 2500],
          target: [400, 700, 1100, 1600, 2200]
        },
        burnRate: {
          value: [4.0, 3.5, 3.0, 2.5, 2.0],
          target: [4.1, 3.6, 3.1, 2.6, 2.1]
        },
        revenue: {
          value: [1200, 1800, 2500, 3200, 4000],
          expenses: [900, 1300, 1800, 2200, 2800]
        },
        grossMargin: {
          value: [55, 58, 62, 67, 71],
          target: [54, 57, 61, 66, 70]
        }
      }
    },
    stats: {
      ebitda: { value: 9.0, change: 15 },
      burnRate: { value: 2.5, change: -8 },
      car: { value: 125, change: 12 },
      churnRate: { value: 2.3, change: -0.5 },
      grossMargin: { value: 68, change: 5 },
      growthRate: { value: 28, change: 5 }
    },
    mouStatus: {
      signed: 15,
      inProgress: 8,
      underReview: 5,
      completed: 18,
      renewed: 10
    },
    marketAnalysis: {
      currentPerformance: {
        marketShare: 75,
        growthRate: 82,
        customerSatisfaction: 90,
        innovationIndex: 85,
        brandValue: 70,
        competitiveEdge: 88
      },
      industryAverage: {
        marketShare: 65,
        growthRate: 70,
        customerSatisfaction: 75,
        innovationIndex: 68,
        brandValue: 72,
        competitiveEdge: 70
      }
    },
    revenueStreams: {
      productSales: 35,
      services: 25,
      subscriptions: 20,
      licensing: 12,
      partnerships: 8
    }
  },

  {
    monthly: {
      metrics: {
        roi: {
          value: [25.5, 26.8, 28.2, 29.5, 31.0, 32.5, 34.0, 35.5, 37.0, 38.5, 40.0, 41.5],
          target: [25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0]
        },
        customerAcquisition: {
          value: [200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420],
          target: [190, 210, 230, 250, 270, 290, 310, 330, 350, 370, 390, 410]
        },
        burnRate: {
          value: [5.0, 4.8, 4.6, 4.4, 4.2, 4.0, 3.8, 3.6, 3.4, 3.2, 3.0, 2.8],
          target: [5.1, 4.9, 4.7, 4.5, 4.3, 4.1, 3.9, 3.7, 3.5, 3.3, 3.1, 2.9]
        },
        revenue: {
          value: [300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630],
          expenses: [250, 270, 290, 310, 330, 350, 370, 390, 410, 430, 450, 470]
        },
        grossMargin: {
          value: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
          target: [69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]
        }
      }
    },
    yearly: {
      metrics: {
        roi: {
          value: [20.0, 25.0, 30.0, 35.0, 41.5],
          target: [19.0, 24.0, 29.0, 34.0, 39.0]
        },
        customerAcquisition: {
          value: [800, 1500, 2500, 3500, 4200],
          target: [750, 1400, 2300, 3200, 4000]
        },
        burnRate: {
          value: [6.0, 5.0, 4.0, 3.5, 2.8],
          target: [6.1, 5.1, 4.1, 3.6, 2.9]
        },
        revenue: {
          value: [2000, 3000, 4000, 5000, 6000],
          expenses: [1600, 2400, 3200, 4000, 4800]
        },
        grossMargin: {
          value: [65, 68, 72, 76, 81],
          target: [64, 67, 71, 75, 80]
        }
      }
    },
    stats: {
      ebitda: { value: 15.0, change: 25 },
      burnRate: { value: 2.8, change: -12 },
      car: { value: 200, change: 30 },
      churnRate: { value: 1.5, change: -1.0 },
      grossMargin: { value: 81, change: 10 },
      growthRate: { value: 45, change: 15 }
    },
    mouStatus: {
      signed: 25,
      inProgress: 15,
      underReview: 10,
      completed: 30,
      renewed: 20
    },
    marketAnalysis: {
      currentPerformance: {
        marketShare: 90,
        growthRate: 95,
        customerSatisfaction: 92,
        innovationIndex: 96,
        brandValue: 85,
        competitiveEdge: 94
      },
      industryAverage: {
        marketShare: 75,
        growthRate: 80,
        customerSatisfaction: 82,
        innovationIndex: 78,
        brandValue: 80,
        competitiveEdge: 82
      }
    },
    revenueStreams: {
      productSales: 45,
      services: 35,
      subscriptions: 30,
      licensing: 20,
      partnerships: 15
    }
  },

  {
    monthly: {
      metrics: {
        "roi": {
          "value": [4.8, 5.3, 5.9, 6.4, 7.0, 7.5, 8.0, 8.3, 8.7, 9.1, 9.4, 9.8],
          "target": [4.5, 5.3, 6.0, 6.8, 7.5, 8.1, 8.6, 9.1, 9.5, 10.0, 10.4, 10.8]
        },
        "customerAcquisition": {
          "value": [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
          "target": [38, 42, 46, 50, 55, 60, 65, 70, 75, 80, 85, 90]
        },
        "burnRate": {
          "value": [5.0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9],
          "target": [5.1, 5.0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0]
        },
        "revenue": {
          "value": [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155],
          "expenses": [70, 73, 76, 79, 82, 85, 88, 91, 94, 97, 100, 103]
        },
        "grossMargin": {
          "value": [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
          "target": [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
        }
      }
    },
    "yearly": {
      "metrics": {
        "roi": {
          "value": [2.5, 4.5, 6.5, 8.5, 10.5],
          "target": [2.0, 4.0, 6.0, 8.0, 10.0]
        },
        "customerAcquisition": {
          "value": [180, 360, 540, 720, 900],
          "target": [170, 340, 510, 680, 850]
        },
        "burnRate": {
          "value": [5.5, 5.0, 4.5, 4.0, 3.5],
          "target": [5.6, 5.1, 4.6, 4.1, 3.6]
        },
        "revenue": {
          "value": [600, 900, 1200, 1500, 1800],
          "expenses": [450, 675, 900, 1125, 1350]
        },
        "grossMargin": {
          "value": [38, 41, 44, 47, 50],
          "target": [37, 40, 43, 46, 49]
        }
      }
    },
    "stats": {
      "ebitda": { "value": 6.0, "change": 12 },
      "burnRate": { "value": 3.9, "change": -4 },
      "car": { "value": 85, "change": 10 },
      "churnRate": { "value": 3.0, "change": -0.2 },
      "grossMargin": { "value": 50, "change": 5 },
      "growthRate": { "value": 18, "change": 4 }
    },
    "mouStatus": {
      "signed": 10,
      "inProgress": 6,
      "underReview": 4,
      "completed": 12,
      "renewed": 7
    },
    "marketAnalysis": {
      "currentPerformance": {
        "marketShare": 48,
        "growthRate": 64,
        "customerSatisfaction": 78,
        "innovationIndex": 72,
        "brandValue": 55,
        "competitiveEdge": 60
      },
      "industryAverage": {
        "marketShare": 62,
        "growthRate": 66,
        "customerSatisfaction": 72,
        "innovationIndex": 65,
        "brandValue": 68,
        "competitiveEdge": 67
      }
    },
    "revenueStreams": {
      "productSales": 28,
      "services": 22,
      "subscriptions": 18,
      "licensing": 10,
      "partnerships": 6
    }
  },

  {
    monthly: {
      metrics: {
        "roi": {
          "value": [4.0, 4.5, 5.0, 5.5, 6.0, 6.4, 6.9, 7.3, 7.7, 8.0, 8.4, 8.7],
          "target": [3.8, 4.3, 4.8, 5.2, 5.7, 6.1, 6.5, 7.0, 7.4, 7.8, 8.1, 8.4]
        },
        "customerAcquisition": {
          "value": [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
          "target": [42, 47, 52, 57, 62, 67, 72, 77, 82, 87, 92, 97]
        },
        "burnRate": {
          "value": [4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, 3.7],
          "target": [4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8]
        },
        "revenue": {
          "value": [90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145],
          "expenses": [65, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99]
        },
        "grossMargin": {
          "value": [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61],
          "target": [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
        }
      }
    },
    "yearly": {
      "metrics": {
        "roi": {
          "value": [2.0, 3.5, 5.0, 6.5, 8.0],
          "target": [1.8, 3.3, 4.8, 6.3, 7.8]
        },
        "customerAcquisition": {
          "value": [150, 300, 450, 600, 750],
          "target": [140, 280, 420, 560, 700]
        },
        "burnRate": {
          "value": [5.0, 4.6, 4.3, 4.0, 3.6],
          "target": [5.1, 4.7, 4.4, 4.1, 3.7]
        },
        "revenue": {
          "value": [800, 1100, 1400, 1700, 2000],
          "expenses": [600, 800, 1000, 1200, 1400]
        },
        "grossMargin": {
          "value": [45, 48, 51, 54, 57],
          "target": [44, 47, 50, 53, 56]
        }
      }
    },
    "stats": {
      "ebitda": { "value": 4.5, "change": 9 },
      "burnRate": { "value": 3.8, "change": -3 },
      "car": { "value": 75, "change": 12 },
      "churnRate": { "value": 3.5, "change": -0.4 },
      "grossMargin": { "value": 58, "change": 6 },
      "growthRate": { "value": 16, "change": 4 }
    },
    "mouStatus": {
      "signed": 9,
      "inProgress": 7,
      "underReview": 4,
      "completed": 11,
      "renewed": 5
    },
    "marketAnalysis": {
      "currentPerformance": {
        "marketShare": 50,
        "growthRate": 60,
        "customerSatisfaction": 80,
        "innovationIndex": 75,
        "brandValue": 55,
        "competitiveEdge": 62
      },
      "industryAverage": {
        "marketShare": 55,
        "growthRate": 62,
        "customerSatisfaction": 78,
        "innovationIndex": 70,
        "brandValue": 60,
        "competitiveEdge": 64
      }
    },
    "revenueStreams": {
      "productSales": 30,
      "services": 18,
      "subscriptions": 12,
      "licensing": 6,
      "partnerships": 4
    }
  },

  {
    monthly: {
      metrics: {
        "roi": {
          "value": [5.0, 5.5, 6.0, 6.5, 7.0, 7.4, 7.8, 8.2, 8.5, 8.9, 9.2, 9.6],
          "target": [4.8, 5.3, 5.8, 6.2, 6.7, 7.1, 7.5, 7.9, 8.2, 8.6, 9.0, 9.4]
        },
        "customerAcquisition": {
          "value": [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
          "target": [58, 63, 68, 73, 78, 83, 88, 93, 98, 103, 108, 113]
        },
        "burnRate": {
          "value": [3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 2.9, 2.8, 2.7, 2.6],
          "target": [3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 2.9, 2.8, 2.7]
        },
        "revenue": {
          "value": [120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175],
          "expenses": [90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123]
        },
        "grossMargin": {
          "value": [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63],
          "target": [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]
        }
      }
    },
    "yearly": {
      "metrics": {
        "roi": {
          "value": [2.2, 3.8, 5.4, 7.0, 8.6],
          "target": [2.0, 3.6, 5.2, 6.8, 8.4]
        },
        "customerAcquisition": {
          "value": [200, 400, 600, 800, 1000],
          "target": [190, 380, 570, 760, 950]
        },
        "burnRate": {
          "value": [4.5, 4.1, 3.7, 3.3, 3.0],
          "target": [4.6, 4.2, 3.8, 3.4, 3.1]
        },
        "revenue": {
          "value": [1200, 1500, 1800, 2100, 2400],
          "expenses": [900, 1100, 1300, 1500, 1700]
        },
        "grossMargin": {
          "value": [46, 49, 52, 55, 58],
          "target": [45, 48, 51, 54, 57]
        }
      }
    },
    "stats": {
      "ebitda": { "value": 7.0, "change": 14 },
      "burnRate": { "value": 3.2, "change": -5 },
      "car": { "value": 95, "change": 18 },
      "churnRate": { "value": 3.0, "change": -0.4 },
      "grossMargin": { "value": 59, "change": 5 },
      "growthRate": { "value": 20, "change": 5 }
    },
    "mouStatus": {
      "signed": 12,
      "inProgress": 8,
      "underReview": 5,
      "completed": 15,
      "renewed": 10
    },
    "marketAnalysis": {
      "currentPerformance": {
        "marketShare": 50,
        "growthRate": 60,
        "customerSatisfaction": 79,
        "innovationIndex": 72,
        "brandValue": 59,
        "competitiveEdge": 65
      },
      "industryAverage": {
        "marketShare": 55,
        "growthRate": 63,
        "customerSatisfaction": 80,
        "innovationIndex": 71,
        "brandValue": 60,
        "competitiveEdge": 66
      }
    },
    "revenueStreams": {
      "productSales": 32,
      "services": 22,
      "subscriptions": 18,
      "licensing": 8,
      "partnerships": 5
    }
  },

  {
    monthly: {
      metrics: {
        "roi": {
          "value": [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.4, 9.8, 10.2, 10.5, 10.8],
          "target": [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.4, 9.8, 10.2, 10.5]
        },
        "customerAcquisition": {
          "value": [70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125],
          "target": [65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120]
        },
        "burnRate": {
          "value": [4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5],
          "target": [4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6]
        },
        "revenue": {
          "value": [150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205],
          "expenses": [110, 114, 118, 122, 126, 130, 134, 138, 142, 146, 150, 154]
        },
        "grossMargin": {
          "value": [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66],
          "target": [54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65]
        }
      }
    },
    "yearly": {
      "metrics": {
        "roi": {
          "value": [3.0, 4.5, 6.0, 7.5, 9.0],
          "target": [2.8, 4.3, 5.8, 7.3, 8.8]
        },
        "customerAcquisition": {
          "value": [250, 500, 750, 1000, 1250],
          "target": [240, 480, 720, 960, 1200]
        },
        "burnRate": {
          "value": [4.8, 4.4, 4.0, 3.6, 3.2],
          "target": [4.9, 4.5, 4.1, 3.7, 3.3]
        },
        "revenue": {
          "value": [2000, 2500, 3000, 3500, 4000],
          "expenses": [1500, 1800, 2100, 2400, 2700]
        },
        "grossMargin": {
          "value": [52, 55, 58, 61, 64],
          "target": [51, 54, 57, 60, 63]
        }
      }
    },
    "stats": {
      "ebitda": { "value": 8.0, "change": 18 },
      "burnRate": { "value": 3.8, "change": -4 },
      "car": { "value": 125, "change": 22 },
      "churnRate": { "value": 2.8, "change": -0.1 },
      "grossMargin": { "value": 63, "change": 7 },
      "growthRate": { "value": 24, "change": 7 }
    },
    "mouStatus": {
      "signed": 15,
      "inProgress": 9,
      "underReview": 6,
      "completed": 18,
      "renewed": 12
    },
    "marketAnalysis": {
      "currentPerformance": {
        "marketShare": 58,
        "growthRate": 70,
        "customerSatisfaction": 85,
        "innovationIndex": 78,
        "brandValue": 70,
        "competitiveEdge": 72
      },
      "industryAverage": {
        "marketShare": 62,
        "growthRate": 73,
        "customerSatisfaction": 82,
        "innovationIndex": 75,
        "brandValue": 74,
        "competitiveEdge": 74
      }
    },
    "revenueStreams": {
      "productSales": 35,
      "services": 25,
      "subscriptions": 15,
      "licensing": 10,
      "partnerships": 5
    }
  },

  {
    monthly: {
      metrics: {
        "roi": {
          "value": [3.9, 4.4, 4.9, 5.3, 5.7, 6.1, 6.5, 6.9, 7.2, 7.6, 8.0, 8.3],
          "target": [3.7, 4.2, 4.7, 5.1, 5.5, 5.9, 6.3, 6.7, 7.0, 7.4, 7.8, 8.1]
        },
        "customerAcquisition": {
          "value": [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
          "target": [28, 33, 38, 43, 48, 53, 58, 63, 68, 73, 78, 83]
        },
        "burnRate": {
          "value": [5.2, 5.1, 5.0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1],
          "target": [5.3, 5.2, 5.1, 5.0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2]
        },
        "revenue": {
          "value": [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
          "expenses": [45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78]
        },
        "grossMargin": {
          "value": [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
          "target": [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
        }
      }
    },
    "yearly": {
      "metrics": {
        "roi": {
          "value": [1.9, 3.4, 5.0, 6.5, 8.0],
          "target": [1.8, 3.2, 4.8, 6.3, 7.8]
        },
        "customerAcquisition": {
          "value": [120, 240, 360, 480, 600],
          "target": [110, 220, 330, 440, 550]
        },
        "burnRate": {
          "value": [5.0, 4.6, 4.2, 3.8, 3.4],
          "target": [5.1, 4.7, 4.3, 3.9, 3.5]
        },
        "revenue": {
          "value": [720, 960, 1200, 1440, 1680],
          "expenses": [540, 720, 900, 1080, 1260]
        },
        "grossMargin": {
          "value": [42, 45, 48, 51, 54],
          "target": [41, 44, 47, 50, 53]
        }
      }
    },
    "stats": {
      "ebitda": { "value": 6.5, "change": 15 },
      "burnRate": { "value": 4.3, "change": -2 },
      "car": { "value": 65, "change": 8 },
      "churnRate": { "value": 4.0, "change": -0.5 },
      "grossMargin": { "value": 49, "change": 4 },
      "growthRate": { "value": 18, "change": 4 }
    },
    "mouStatus": {
      "signed": 7,
      "inProgress": 5,
      "underReview": 3,
      "completed": 9,
      "renewed": 4
    },
    "marketAnalysis": {
      "currentPerformance": {
        "marketShare": 50,
        "growthRate": 58,
        "customerSatisfaction": 76,
        "innovationIndex": 67,
        "brandValue": 62,
        "competitiveEdge": 63
      },
      "industryAverage": {
        "marketShare": 54,
        "growthRate": 61,
        "customerSatisfaction": 78,
        "innovationIndex": 69,
        "brandValue": 64,
        "competitiveEdge": 65
      }
    },
    "revenueStreams": {
      "productSales": 28,
      "services": 22,
      "subscriptions": 15,
      "licensing": 8,
      "partnerships": 7
    }
  },

  {
    monthly: {
      metrics: {
        "roi": {
          "value": [6.2, 6.8, 7.3, 7.7, 8.1, 8.5, 8.9, 9.3, 9.7, 10.1, 10.5, 10.9],
          "target": [5.9, 6.4, 6.9, 7.3, 7.8, 8.2, 8.6, 9.0, 9.4, 9.8, 10.2, 10.6]
        },
        "customerAcquisition": {
          "value": [90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145],
          "target": [85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140]
        },
        "burnRate": {
          "value": [3.9, 3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 2.9, 2.8],
          "target": [4.0, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 2.9]
        },
        "revenue": {
          "value": [180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235],
          "expenses": [135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190]
        },
        "grossMargin": {
          "value": [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
          "target": [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68]
        }
      }
    },
    "yearly": {
      "metrics": {
        "roi": {
          "value": [3.3, 4.8, 6.3, 7.8, 9.3],
          "target": [3.0, 4.5, 6.0, 7.5, 9.0]
        },
        "customerAcquisition": {
          "value": [300, 600, 900, 1200, 1500],
          "target": [280, 560, 840, 1120, 1400]
        },
        "burnRate": {
          "value": [4.5, 4.2, 3.9, 3.6, 3.3],
          "target": [4.6, 4.3, 4.0, 3.7, 3.4]
        },
        "revenue": {
          "value": [2500, 3000, 3500, 4000, 4500],
          "expenses": [2000, 2400, 2800, 3200, 3600]
        },
        "grossMargin": {
          "value": [55, 58, 61, 64, 67],
          "target": [54, 57, 60, 63, 66]
        }
      }
    },
    "stats": {
      "ebitda": { "value": 10.2, "change": 22 },
      "burnRate": { "value": 3.2, "change": -6 },
      "car": { "value": 140, "change": 27 },
      "churnRate": { "value": 3.2, "change": -0.2 },
      "grossMargin": { "value": 64, "change": 8 },
      "growthRate": { "value": 27, "change": 6 }
    },
    "mouStatus": {
      "signed": 17,
      "inProgress": 12,
      "underReview": 7,
      "completed": 19,
      "renewed": 15
    },
    "marketAnalysis": {
      "currentPerformance": {
        "marketShare": 65,
        "growthRate": 78,
        "customerSatisfaction": 90,
        "innovationIndex": 82,
        "brandValue": 75,
        "competitiveEdge": 77
      },
      "industryAverage": {
        "marketShare": 68,
        "growthRate": 80,
        "customerSatisfaction": 92,
        "innovationIndex": 84,
        "brandValue": 76,
        "competitiveEdge": 79
      }
    },
    "revenueStreams": {
      "productSales": 40,
      "services": 30,
      "subscriptions": 15,
      "licensing": 8,
      "partnerships": 7
    }
  }
];

// Labels remain the same for all startups
const LABELS = {
  monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  yearly: ['2019', '2020', '2021', '2022', '2023']
};

// Type guards
function isValidMetric(metric: string | null): metric is MetricKey {
  return metric !== null && [
    'roi',
    'customerAcquisition',
    'burnRate',
    'revenue',
    'grossMargin'
  ].includes(metric as MetricKey);
}

function isValidTimeframe(timeframe: string): timeframe is TimeframeKey {
  return ['monthly', 'yearly'].includes(timeframe as TimeframeKey);
}

// Add stats data structure
interface StatData {
  value: number;
  change: number;
}



// Add fake stats data
const STARTUP_STATS = [
  {
    weekly: {
      revenue: { value: 15000, change: 10.3 },
      customerGrowth: { value: 100, change: 8.0 },
      burnRate: { value: 4000, change: -2.5 },
      roi: { value: 12.0, change: 5.5 },
      marketShare: { value: 30, change: 3.0 },
      growthRate: { value: 20.0, change: 7.2 }
    },
    monthly: {
      revenue: { value: 60000, change: 13.2 },
      customerGrowth: { value: 400, change: 12.5 },
      burnRate: { value: 16000, change: -4.0 },
      roi: { value: 15.0, change: 6.2 },
      marketShare: { value: 35, change: 3.2 },
      growthRate: { value: 22.0, change: 6.5 }
    },
    yearly: {
      revenue: { value: 720000, change: 28.5 },
      customerGrowth: { value: 4800, change: 17.8 },
      burnRate: { value: 192000, change: -8.0 },
      roi: { value: 18.0, change: 9.3 },
      marketShare: { value: 40, change: 5.1 },
      growthRate: { value: 25.0, change: 9.2 }
    }
  },
  {
    weekly: {
      revenue: { value: 10000, change: 8.5 },
      customerGrowth: { value: 80, change: 7.0 },
      burnRate: { value: 3000, change: -3.0 },
      roi: { value: 10.0, change: 4.0 },
      marketShare: { value: 10, change: 2.0 },
      growthRate: { value: 15.0, change: 5.2 }
    },
    monthly: {
      revenue: { value: 40000, change: 11.0 },
      customerGrowth: { value: 320, change: 8.8 },
      burnRate: { value: 12000, change: -4.5 },
      roi: { value: 12.0, change: 5.8 },
      marketShare: { value: 12, change: 2.3 },
      growthRate: { value: 17.0, change: 6.0 }
    },
    yearly: {
      revenue: { value: 480000, change: 24.0 },
      customerGrowth: { value: 3800, change: 19.0 },
      burnRate: { value: 144000, change: -7.2 },
      roi: { value: 14.0, change: 8.2 },
      marketShare: { value: 15, change: 4.5 },
      growthRate: { value: 19.0, change: 8.0 }
    }
  },
  {
    weekly: {
      revenue: { value: 18000, change: 12.5 },
      customerGrowth: { value: 120, change: 10.5 },
      burnRate: { value: 5000, change: -3.5 },
      roi: { value: 15.5, change: 6.8 },
      marketShare: { value: 20, change: 2.5 },
      growthRate: { value: 18.0, change: 6.3 }
    },
    monthly: {
      revenue: { value: 72000, change: 14.5 },
      customerGrowth: { value: 480, change: 11.2 },
      burnRate: { value: 20000, change: -5.0 },
      roi: { value: 18.0, change: 7.5 },
      marketShare: { value: 22, change: 3.0 },
      growthRate: { value: 20.0, change: 7.5 }
    },
    yearly: {
      revenue: { value: 864000, change: 28.3 },
      customerGrowth: { value: 5500, change: 22.0 },
      burnRate: { value: 240000, change: -8.5 },
      roi: { value: 20.5, change: 9.3 },
      marketShare: { value: 25, change: 4.3 },
      growthRate: { value: 22.0, change: 8.0 }
    }
  },
  {
    weekly: {
      revenue: { value: 25000, change: 9.0 },
      customerGrowth: { value: 180, change: 10.0 },
      burnRate: { value: 7000, change: -3.0 },
      roi: { value: 14.0, change: 5.2 },
      marketShare: { value: 18, change: 2.8 },
      growthRate: { value: 19.5, change: 6.5 }
    },
    monthly: {
      revenue: { value: 100000, change: 12.0 },
      customerGrowth: { value: 720, change: 11.5 },
      burnRate: { value: 28000, change: -4.2 },
      roi: { value: 16.0, change: 6.0 },
      marketShare: { value: 20, change: 3.0 },
      growthRate: { value: 21.0, change: 7.2 }
    },
    yearly: {
      revenue: { value: 1200000, change: 26.3 },
      customerGrowth: { value: 8500, change: 19.5 },
      burnRate: { value: 336000, change: -7.0 },
      roi: { value: 18.0, change: 8.5 },
      marketShare: { value: 25, change: 4.2 },
      growthRate: { value: 23.0, change: 8.5 }
    }
  },
  {
    weekly: {
      revenue: { value: 12000, change: 7.5 },
      customerGrowth: { value: 100, change: 8.3 },
      burnRate: { value: 3500, change: -2.7 },
      roi: { value: 10.5, change: 4.0 },
      marketShare: { value: 12, change: 1.5 },
      growthRate: { value: 16.5, change: 5.0 }
    },
    monthly: {
      revenue: { value: 48000, change: 10.0 },
      customerGrowth: { value: 400, change: 9.5 },
      burnRate: { value: 14000, change: -3.5 },
      roi: { value: 12.0, change: 5.2 },
      marketShare: { value: 13, change: 1.8 },
      growthRate: { value: 18.0, change: 6.0 }
    },
    yearly: {
      revenue: { value: 576000, change: 22.3 },
      customerGrowth: { value: 4800, change: 15.5 },
      burnRate: { value: 168000, change: -6.0 },
      roi: { value: 14.0, change: 7.0 },
      marketShare: { value: 15, change: 2.5 },
      growthRate: { value: 20.0, change: 7.5 }
    }
  },
  {
    weekly: {
      revenue: { value: 22000, change: 10.5 },
      customerGrowth: { value: 140, change: 9.0 },
      burnRate: { value: 6000, change: -2.5 },
      roi: { value: 13.5, change: 4.5 },
      marketShare: { value: 25, change: 3.5 },
      growthRate: { value: 21.0, change: 6.0 }
    },
    monthly: {
      revenue: { value: 88000, change: 13.0 },
      customerGrowth: { value: 560, change: 11.0 },
      burnRate: { value: 24000, change: -3.0 },
      roi: { value: 16.5, change: 5.8 },
      marketShare: { value: 28, change: 3.8 },
      growthRate: { value: 23.0, change: 6.5 }
    },
    yearly: {
      revenue: { value: 1056000, change: 27.5 },
      customerGrowth: { value: 7200, change: 20.5 },
      burnRate: { value: 288000, change: -6.5 },
      roi: { value: 19.5, change: 8.0 },
      marketShare: { value: 32, change: 4.2 },
      growthRate: { value: 25.0, change: 7.0 }
    }
  },
  {
    weekly: {
      revenue: { value: 14000, change: 9.2 },
      customerGrowth: { value: 110, change: 7.5 },
      burnRate: { value: 4500, change: -3.0 },
      roi: { value: 11.5, change: 5.0 },
      marketShare: { value: 18, change: 2.5 },
      growthRate: { value: 19.0, change: 5.8 }
    },
    monthly: {
      revenue: { value: 56000, change: 11.5 },
      customerGrowth: { value: 440, change: 10.0 },
      burnRate: { value: 18000, change: -4.0 },
      roi: { value: 14.0, change: 6.2 },
      marketShare: { value: 20, change: 2.8 },
      growthRate: { value: 21.5, change: 6.5 }
    },
    yearly: {
      revenue: { value: 672000, change: 23.0 },
      customerGrowth: { value: 5280, change: 18.0 },
      burnRate: { value: 216000, change: -6.2 },
      roi: { value: 17.5, change: 7.5 },
      marketShare: { value: 22, change: 3.0 },
      growthRate: { value: 24.0, change: 7.2 }
    }
  },
  {
    weekly: {
      revenue: { value: 11000, change: 8.0 },
      customerGrowth: { value: 90, change: 6.5 },
      burnRate: { value: 3200, change: -3.2 },
      roi: { value: 9.5, change: 3.8 },
      marketShare: { value: 8, change: 1.5 },
      growthRate: { value: 13.5, change: 5.2 }
    },
    monthly: {
      revenue: { value: 44000, change: 10.0 },
      customerGrowth: { value: 360, change: 8.5 },
      burnRate: { value: 12800, change: -3.8 },
      roi: { value: 11.0, change: 4.5 },
      marketShare: { value: 10, change: 2.0 },
      growthRate: { value: 15.5, change: 5.5 }
    },
    yearly: {
      revenue: { value: 528000, change: 21.0 },
      customerGrowth: { value: 4320, change: 16.0 },
      burnRate: { value: 153600, change: -5.5 },
      roi: { value: 13.0, change: 6.2 },
      marketShare: { value: 12, change: 2.5 },
      growthRate: { value: 17.0, change: 6.0 }
    }
  },
  {
    weekly: {
      revenue: { value: 16000, change: 9.5 },
      customerGrowth: { value: 130, change: 8.5 },
      burnRate: { value: 4600, change: -2.9 },
      roi: { value: 13.2, change: 5.3 },
      marketShare: { value: 22, change: 2.2 },
      growthRate: { value: 17.8, change: 5.9 }
    },
    monthly: {
      revenue: { value: 64000, change: 12.5 },
      customerGrowth: { value: 520, change: 9.8 },
      burnRate: { value: 18400, change: -4.2 },
      roi: { value: 15.0, change: 6.0 },
      marketShare: { value: 25, change: 3.0 },
      growthRate: { value: 20.0, change: 6.8 }
    },
    yearly: {
      revenue: { value: 768000, change: 25.8 },
      customerGrowth: { value: 6240, change: 19.0 },
      burnRate: { value: 220800, change: -7.0 },
      roi: { value: 18.0, change: 7.5 },
      marketShare: { value: 30, change: 4.5 },
      growthRate: { value: 22.0, change: 7.2 }
    }
  },
  {
    weekly: {
      revenue: { value: 21000, change: 11.0 },
      customerGrowth: { value: 160, change: 9.8 },
      burnRate: { value: 5500, change: -2.7 },
      roi: { value: 14.2, change: 4.8 },
      marketShare: { value: 26, change: 3.0 },
      growthRate: { value: 22.5, change: 6.3 }
    },
    monthly: {
      revenue: { value: 84000, change: 14.0 },
      customerGrowth: { value: 640, change: 11.5 },
      burnRate: { value: 22000, change: -3.8 },
      roi: { value: 16.0, change: 5.5 },
      marketShare: { value: 30, change: 3.5 },
      growthRate: { value: 24.0, change: 6.5 }
    },
    yearly: {
      revenue: { value: 1008000, change: 27.0 },
      customerGrowth: { value: 7800, change: 21.0 },
      burnRate: { value: 264000, change: -6.0 },
      roi: { value: 18.5, change: 6.8 },
      marketShare: { value: 35, change: 4.0 },
      growthRate: { value: 26.0, change: 7.0 }
    }
  }
];




// Update the GET function to include stats data
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get('timeframe') || 'monthly') as TimeframeKey;
    const metric = searchParams.get('metric');
    const startupId = searchParams.get('startupId') || 'default';

    if (!isValidTimeframe(timeframe)) {
      return NextResponse.json({ error: "Invalid timeframe" }, { status: 400 });
    }

    const startups = await Startup.find();
    const startupIndex = startups.findIndex(startup => startup._id.toString() === startupId);


    // Get startup specific data or fallback to index 2 (which contains the default/demo data)
    const startupData = STARTUP_METRICS[startupIndex] || STARTUP_METRICS[2];
    const statsData = STARTUP_STATS[startupIndex]?.[timeframe] || STARTUP_STATS[2][timeframe];

    if (metric && isValidMetric(metric)) {
      return NextResponse.json({
        success: true,
        data: {
          timeframe,
          labels: LABELS[timeframe],
          metrics: {
            [metric]: startupData[timeframe].metrics[metric]
          },
          stats: statsData
        }
      });
    }

    // Return all metrics and stats
    return NextResponse.json({
      success: true,
      data: {
        timeframe,
        labels: LABELS[timeframe],
        metrics: startupData[timeframe].metrics,
        stats: statsData,
        mouStatus: startupData.mouStatus,
        marketAnalysis: startupData.marketAnalysis,
        revenueStreams: startupData.revenueStreams
      }
    });

  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
