import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

import { getServerSession } from "next-auth";
import Startup from "@/models/startup.model";
import { TimeframeKey } from "@/types/metrics";
const STARTUPS_DATA = [{
    yearly: [
        {
            year: "2023",
            data: [3687226, 2715672, 2832594, 3687226, 2715672, 2832594, 3687226, 2715672, 2832594, 3687226, 2715672, 2832594] // scaled by 11 times
        },
        {
            year: "2022",
            data: [3765773, 3688884, 3765773, 3688884, 3765773, 3688884, 3765773, 3688884, 3765773, 3688884, 3765773, 3688884] // scaled by 11 times
        },
        {
            year: "2021",
            data: [3160531, 3005651, 3160531, 3005651, 3160531, 3005651, 3160531, 3005651, 3160531, 3005651, 3160531, 3005651] // scaled by 11 times
        },
        {
            year: "2020",
            data: [3941223, 3743433, 3941223, 3743433, 3941223, 3743433, 3941223, 3743433, 3941223, 3743433, 3941223, 3743433] // scaled by 11 times
        },
        {
            year: "2019",
            data: [4119922, 3943431, 4131334, 3943431, 4131334, 3943431, 4131334, 3943431, 4131334, 3943431, 4131334, 3943431] // scaled by 12 times
        }
    ],
    monthly: [
        {
            month: "Jan",
            data: [334294, 246879, 255914, 334294, 246879, 255914, 334294, 246879, 255914, 334294, 246879, 255914]
        },
        {
            month: "Feb",
            data: [342343, 333534, 342343, 333534, 342343, 333534, 342343, 333534, 342343, 333534, 342343, 333534]
        },
        {
            month: "Mar",
            data: [287321, 273241, 287321, 273241, 287321, 273241, 287321, 273241, 287321, 273241, 287321, 273241]
        },
        {
            month: "Apr",
            data: [358293, 342130, 358293, 342130, 358293, 342130, 358293, 342130, 358293, 342130, 358293, 342130]
        },
        {
            month: "May",
            data: [376485, 358293, 376485, 358293, 376485, 358293, 376485, 358293, 376485, 358293, 376485, 358293]
        },
        {
            month: "June",
            data: [398743, 375193, 398743, 375193, 398743, 375193, 398743, 375193, 398743, 375193, 398743, 375193]
        },
        {
            month: "July",
            data: [411582, 392138, 411582, 392138, 411582, 392138, 411582, 392138, 411582, 392138, 411582, 392138]
        },
        {
            month: "Aug",
            data: [432097, 409872, 432097, 409872, 432097, 409872, 432097, 409872, 432097, 409872, 432097, 409872]
        },
        {
            month: "Sep",
            data: [394237, 366501, 394237, 366501, 394237, 366501, 394237, 366501, 394237, 366501, 394237, 366501]
        },
        {
            month: "Oct",
            data: [478231, 453763, 478231, 453763, 478231, 453763, 478231, 453763, 478231, 453763, 478231, 453763]
        },
        {
            month: "Nov",
            data: [510034, 481234, 510034, 481234, 510034, 481234, 510034, 481234, 510034, 481234, 510034, 481234]
        },
        {
            month: "Dec",
            data: [523145, 498234, 523145, 498234, 523145, 498234, 523145, 498234, 523145, 498234, 523145, 498234]
        }
    ]
}];
function isValidTimeframe(timeframe: string): timeframe is TimeframeKey {
    return ['monthly', 'yearly'].includes(timeframe as TimeframeKey);
}

 const InvestmentVsROI = [
    {
      yearly: [
        {
          year: "2023",
          data: [
            { investment: 130000, ROI: 12 },  // First startup
            { investment: 180000, ROI: 6 },
            { investment: 250000, ROI: 10 },
            { investment: 200000, ROI: 7 },
            { investment: 450000, ROI: 15 },
            { investment: 520000, ROI: 8 },
            { investment: 1200000, ROI: -2 },  // Negative value
            { investment: 800000, ROI: 9 },
            { investment: 1500000, ROI: 18 },
            { investment: 700000, ROI: 11 },
            { investment: 2200000, ROI: -3 },  // Negative value
            { investment: 600000, ROI: 6 }
          ]
        },
        {
          year: "2024",
          data: [
            { investment: 110000, ROI: 10 },  // First startup
            { investment: 170000, ROI: 7 },
            { investment: 280000, ROI: 9 },
            { investment: 240000, ROI: 8 },
            { investment: 400000, ROI: 14 },
            { investment: 520000, ROI: 6 },
            { investment: 1300000, ROI: 5 },
            { investment: 850000, ROI: 12 },
            { investment: 1600000, ROI: 16 },
            { investment: 750000, ROI: 10 },
            { investment: 2100000, ROI: -1 },  // Negative value
            { investment: 650000, ROI: 5 }
          ]
        },
        {
          year: "2025",
          data: [
            { investment: 140000, ROI: 13 },  // First startup
            { investment: 200000, ROI: 9 },
            { investment: 320000, ROI: 12 },
            { investment: 260000, ROI: 11 },
            { investment: 420000, ROI: 15 },
            { investment: 530000, ROI: 19 },
            { investment: 1250000, ROI: -3 },  // Negative value
            { investment: 900000, ROI: 10 },
            { investment: 1700000, ROI: 17 },
            { investment: 770000, ROI: 11 },
            { investment: 2300000, ROI: 2 },
            { investment: 680000, ROI: 8 }
          ]
        }
      ],
      monthly: [
        {
          month: "Jan",
          data: [
            { investment: 100000, ROI: 12 },  // First startup
            { investment: 150000, ROI: 5 },
            { investment: 200000, ROI: 9 },
            { investment: 180000, ROI: 7 },
            { investment: 210000, ROI: 13 },
            { investment: 160000, ROI: 8 },
            { investment: 220000, ROI: 10 },
            { investment: 250000, ROI: 14 },
            { investment: 170000, ROI: 6 },
            { investment: 140000, ROI: -3 },  // Negative value
            { investment: 190000, ROI: 8 },
            { investment: 230000, ROI: 9 }
          ]
        },
        {
          month: "Feb",
          data: [
            { investment: 120000, ROI: 15 },  // First startup
            { investment: 180000, ROI: 10 },
            { investment: 170000, ROI: 5 },
            { investment: 160000, ROI: 12 },
            { investment: 190000, ROI: 8 },
            { investment: 200000, ROI: -4 },  // Negative value
            { investment: 220000, ROI: 14 },
            { investment: 210000, ROI: 13 },
            { investment: 240000, ROI: 9 },
            { investment: 150000, ROI: 3 },
            { investment: 190000, ROI: 10 },
            { investment: 230000, ROI: 6 }
          ]
        },
        {
          month: "Mar",
          data: [
            { investment: 110000, ROI: 10 },  // First startup
            { investment: 160000, ROI: 8 },
            { investment: 180000, ROI: 7 },
            { investment: 170000, ROI: 14 },
            { investment: 200000, ROI: 12 },
            { investment: 220000, ROI: 3 },
            { investment: 250000, ROI: 16 },
            { investment: 240000, ROI: 9 },
            { investment: 230000, ROI: -1 },  // Negative value
            { investment: 190000, ROI: 9 },
            { investment: 210000, ROI: 11 },
            { investment: 260000, ROI: 8 }
          ]
        },
        {
          month: "Apr",
          data: [
            { investment: 130000, ROI: 12 },  // First startup
            { investment: 170000, ROI: 5 },
            { investment: 180000, ROI: 6 },
            { investment: 200000, ROI: 14 },
            { investment: 190000, ROI: 9 },
            { investment: 220000, ROI: 7 },
            { investment: 250000, ROI: 13 },
            { investment: 240000, ROI: 8 },
            { investment: 230000, ROI: 10 },
            { investment: 210000, ROI: 6 },
            { investment: 220000, ROI: 15 },
            { investment: 180000, ROI: 12 }
          ]
        },
        {
          month: "May",
          data: [
            { investment: 140000, ROI: -14 },  // First startup, negative
            { investment: 180000, ROI: 7 },
            { investment: 160000, ROI: 13 },
            { investment: 190000, ROI: 11 },
            { investment: 200000, ROI: 16 },
            { investment: 230000, ROI: 3 },
            { investment: 210000, ROI: 8 },
            { investment: 250000, ROI: 12 },
            { investment: 220000, ROI: 9 },
            { investment: 240000, ROI: 6 },
            { investment: 260000, ROI: 15 },
            { investment: 230000, ROI: 10 }
          ]
        },
        {
          month: "Jun",
          data: [
            { investment: 150000, ROI: 16 },  // First startup
            { investment: 190000, ROI: -2 },  // Negative value
            { investment: 200000, ROI: 10 },
            { investment: 220000, ROI: 13 },
            { investment: 240000, ROI: 8 },
            { investment: 210000, ROI: 5 },
            { investment: 250000, ROI: 18 },
            { investment: 270000, ROI: 9 },
            { investment: 230000, ROI: 14 },
            { investment: 220000, ROI: 6 },
            { investment: 240000, ROI: 12 },
            { investment: 260000, ROI: 7 }
          ]
        },
        {
          month: "Jul",
          data: [
            { investment: 160000, ROI: 11 },  // First startup
            { investment: 200000, ROI: 6 },
            { investment: 180000, ROI: 9 },
            { investment: 230000, ROI: 14 },
            { investment: 250000, ROI: 12 },
            { investment: 240000, ROI: -4 },  // Negative value
            { investment: 220000, ROI: 10 },
            { investment: 210000, ROI: 11 },
            { investment: 250000, ROI: 15 },
            { investment: 260000, ROI: 7 },
            { investment: 230000, ROI: 8 },
            { investment: 270000, ROI: 6 }
          ]
        },
        {
          month: "Aug",
          data: [
            { investment: 170000, ROI: 10 },  // First startup
            { investment: 210000, ROI: -3 },  // Negative value
            { investment: 200000, ROI: 5 },
            { investment: 240000, ROI: 12 },
            { investment: 250000, ROI: 14 },
            { investment: 220000, ROI: 3 },
            { investment: 260000, ROI: 9 },
            { investment: 230000, ROI: 8 },
            { investment: 210000, ROI: 6 },
            { investment: 250000, ROI: 7 },
            { investment: 240000, ROI: 11 },
            { investment: 220000, ROI: 10 }
          ]
        },
        {
          month: "Sep",
          data: [
            { investment: 180000, ROI: 13 },  // First startup
            { investment: 220000, ROI: 8 },
            { investment: 210000, ROI: 12 },
            { investment: 250000, ROI: 9 },
            { investment: 240000, ROI: 14 },
            { investment: 230000, ROI: -2 },  // Negative value
            { investment: 220000, ROI: 6 },
            { investment: 250000, ROI: 10 },
            { investment: 230000, ROI: 5 },
            { investment: 270000, ROI: 7 },
            { investment: 250000, ROI: 8 },
            { investment: 230000, ROI: 12 }
          ]
        },
        {
          month: "Oct",
          data: [
            { investment: 190000, ROI: 14 },  // First startup
            { investment: 230000, ROI: -1 },
            { investment: 210000, ROI: 10 },
            { investment: 240000, ROI: 12 },
            { investment: 260000, ROI: 13 },
            { investment: 220000, ROI: 6 },
            { investment: 230000, ROI: 7 },
            { investment: 250000, ROI: 9 },
            { investment: 240000, ROI: 5 },
            { investment: 220000, ROI: 8 },
            { investment: 210000, ROI: 10 },
            { investment: 260000, ROI: 11 }
          ]
        },
        {
          month: "Nov",
          data: [
            { investment: 200000, ROI: 15 },  // First startup
            { investment: 240000, ROI: 7 },
            { investment: 230000, ROI: 12 },
            { investment: 260000, ROI: 9 },
            { investment: 250000, ROI: 14 },
            { investment: 270000, ROI: 5 },
            { investment: 220000, ROI: 10 },
            { investment: 240000, ROI: 6 },
            { investment: 230000, ROI: 8 },
            { investment: 210000, ROI: 9 },
            { investment: 250000, ROI: 7 },
            { investment: 220000, ROI: 10 }
          ]
        },
        {
          month: "Dec",
          data: [
            { investment: 210000, ROI: 16 },  // First startup
            { investment: 250000, ROI: -4 },  // Negative value
            { investment: 230000, ROI: 11 },
            { investment: 270000, ROI: 7 },
            { investment: 240000, ROI: 10 },
            { investment: 250000, ROI: 12 },
            { investment: 220000, ROI: 8 },
            { investment: 200000, ROI: 5 },
            { investment: 230000, ROI: 9 },
            { investment: 240000, ROI: 7 },
            { investment: 260000, ROI: 10 },
            { investment: 250000, ROI: 9 }
          ]
        }
      ]
    }
  ];
  
  
  

export async function POST(req: NextRequest) {
    try {
        console.log("Request received");
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        console.log("Connected to DB");

        const { searchParams } = new URL(req.url);
        const timeframe = (searchParams.get('timeframe') || 'monthly') as TimeframeKey;

        if (!isValidTimeframe(timeframe)) {
            return NextResponse.json({ error: "Invalid timeframe" }, { status: 400 });
        }

        const { startupIds } = await req.json();
        console.log("Startup IDs:", startupIds);

        // Find startups and get their indices
        const startups = await Startup.find({ _id: { $in: startupIds } });
        const startupIndices = startupIds.map((id: string) => startups.findIndex(startup => startup._id.toString() === id));
        const startupNames = startups.map(startup => startup.startupDetails.startupName);
        console.log("Startup Indices:", startupIndices);

        // Get data for each startup index
        const startupsData = STARTUPS_DATA[0][timeframe].map(period => {
            const periodKey = timeframe === 'monthly' ? 'month' : 'year';
            // Filter data array to only include requested indices
            const filteredData = period.data.filter((_, index) => startupIndices.includes(index));
            return {
                [periodKey]: period[periodKey as keyof typeof period],
                data: filteredData
            };
        });

        // Get investment vs ROI data for each startup
        const investmentROIData = InvestmentVsROI[0][timeframe].map(period => {
            const periodKey = timeframe === 'monthly' ? 'month' : 'year';
            // Filter data array to only include requested indices
            const filteredData = period.data.filter((_, index) => startupIndices.includes(index));
            return {
                [periodKey]: period[periodKey as keyof typeof period],
                data: filteredData
            };
        });
        console.log(timeframe, startupNames, startupIndices, startupsData, investmentROIData);

        return NextResponse.json({
            success: true,
            data: {
                timeframe,
                startupNames,
                startupIndices,
                startupsData,
                investmentVsROI: investmentROIData
            }
        });

    } catch (error) {
        console.error("Error in POST route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}