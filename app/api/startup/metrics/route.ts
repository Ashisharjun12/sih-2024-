import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MetricKey, TimeframeKey, MetricsData, MetricData } from "@/types/metrics";

// Type for the metrics data store with startup ID
type StartupMetricsStore = {
  [startupId: string]: MetricsDataStore;
};

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
const STARTUP_METRICS: StartupMetricsStore = {
  // High-growth startup
  "startup-1": {
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
  "startup-2": {
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
  "default": {
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

  "startup-3": { 
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
  }
};

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

interface StartupStats {
  [startupId: string]: {
    weekly: {
      revenue: StatData;
      customerGrowth: StatData;
      burnRate: StatData;
      roi: StatData;
      marketShare: StatData;
      growthRate: StatData;
    };
    monthly: {
      revenue: StatData;
      customerGrowth: StatData;
      burnRate: StatData;
      roi: StatData;
      marketShare: StatData;
      growthRate: StatData;
    };
    yearly: {
      revenue: StatData;
      customerGrowth: StatData;
      burnRate: StatData;
      roi: StatData;
      marketShare: StatData;
      growthRate: StatData;
    };
  };
}

// Add fake stats data
const STARTUP_STATS: StartupStats = {
  "startup-1": {
    weekly: {
      revenue: { value: 24563, change: 15.3 },
      customerGrowth: { value: 156, change: 12.5 },
      burnRate: { value: 8500, change: -5.2 },
      roi: { value: 28.5, change: 8.7 },
      marketShare: { value: 85, change: 4.2 },
      growthRate: { value: 32, change: 6.8 }
    },
    monthly: {
      revenue: { value: 98252, change: 22.4 },
      customerGrowth: { value: 625, change: 18.9 },
      burnRate: { value: 34000, change: -8.5 },
      roi: { value: 31.2, change: 12.3 },
      marketShare: { value: 87, change: 5.8 },
      growthRate: { value: 35, change: 8.9 }
    },
    yearly: {
      revenue: { value: 1179024, change: 45.8 },
      customerGrowth: { value: 7500, change: 35.6 },
      burnRate: { value: 408000, change: -15.3 },
      roi: { value: 41.5, change: 18.7 },
      marketShare: { value: 90, change: 12.5 },
      growthRate: { value: 45, change: 15.4 }
    }
  },
  "startup-2": {
    weekly: {
      revenue: { value: 12281, change: 8.4 },
      customerGrowth: { value: 78, change: 6.2 },
      burnRate: { value: 4250, change: -2.8 },
      roi: { value: 14.2, change: 4.3 },
      marketShare: { value: 42, change: 2.1 },
      growthRate: { value: 16, change: 3.4 }
    },
    monthly: {
      revenue: { value: 49126, change: 11.2 },
      customerGrowth: { value: 312, change: 9.4 },
      burnRate: { value: 17000, change: -4.2 },
      roi: { value: 15.6, change: 6.1 },
      marketShare: { value: 45, change: 2.9 },
      growthRate: { value: 17.5, change: 4.4 }
    },
    yearly: {
      revenue: { value: 589512, change: 22.9 },
      customerGrowth: { value: 3750, change: 17.8 },
      burnRate: { value: 204000, change: -7.6 },
      roi: { value: 20.7, change: 9.3 },
      marketShare: { value: 50, change: 6.2 },
      growthRate: { value: 22.5, change: 7.7 }
    }
  },
  "default": {
    weekly: {
      revenue: { value: 18422, change: 11.8 },
      customerGrowth: { value: 117, change: 9.3 },
      burnRate: { value: 6375, change: -4 },
      roi: { value: 21.3, change: 6.5 },
      marketShare: { value: 63, change: 3.1 },
      growthRate: { value: 24, change: 5.1 }
    },
    monthly: {
      revenue: { value: 73689, change: 16.8 },
      customerGrowth: { value: 468, change: 14.1 },
      burnRate: { value: 25500, change: -6.3 },
      roi: { value: 23.4, change: 9.2 },
      marketShare: { value: 67, change: 4.3 },
      growthRate: { value: 26.2, change: 6.6 }
    },
    yearly: {
      revenue: { value: 884268, change: 34.3 },
      customerGrowth: { value: 5625, change: 26.7 },
      burnRate: { value: 306000, change: -11.4 },
      roi: { value: 31.1, change: 14 },
      marketShare: { value: 70, change: 9.3 },
      growthRate: { value: 33.7, change: 11.5 }
    }
  }
};

// Update the GET function to include stats data
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get('timeframe') || 'monthly') as TimeframeKey;
    const metric = searchParams.get('metric');
    const startupId = searchParams.get('startupId') || 'default';

    if (!isValidTimeframe(timeframe)) {
      return NextResponse.json({ error: "Invalid timeframe" }, { status: 400 });
    }

    // Get startup specific data or fallback to default
    const startupData = STARTUP_METRICS[startupId] || STARTUP_METRICS.default;
    const statsData = STARTUP_STATS[startupId]?.[timeframe] || STARTUP_STATS.default[timeframe];

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
