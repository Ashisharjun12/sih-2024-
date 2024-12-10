import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import FundingAgency from "@/models/funding-agency.model";
import { Types } from "mongoose";

interface Investment {
  _id: Types.ObjectId;
  fundingAgency: {
    _id: string;
    userId: string;
    agencyName: string;
    logo: {
      secure_url: string;
    };
  };
  amount: number;
  date: Date;
}

interface Request {
  _id: Types.ObjectId;
  fundingAgency: {
    _id: string;
    userId: string;
    agencyName: string;
    logo: {
      secure_url: string;
    };
  };
  message: string;
  createdAt?: Date;
}

export async function GET() {
  try {
    console.log("API Step 1: Starting startup fundings fetch");
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log("API Error: No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("API Step 2: User role:", session.user.role);
    if (session.user.role !== "startup") {
      console.log("API Error: User is not a startup");
      return NextResponse.json({ error: "Only startups can access this endpoint" }, { status: 403 });
    }

    await connectDB();
    console.log("API Step 3: Connected to database");

    console.log("API Step 4: Finding startup with userId:", session.user.id);
    const startup = await Startup.findOne({ userId: session.user.id })
      .populate({
        path: "activeInvestments.fundingAgency",
        select: "userId agencyDetails.name agencyDetails.logo",
        model: FundingAgency
      })
      .populate({
        path: "requests.fundingAgency",
        select: "userId agencyDetails.name agencyDetails.logo",
        model: FundingAgency
      });

    if (!startup) {
      console.log("API Error: Startup not found for userId:", session.user.id);
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    console.log("API Step 5: Found startup:", {
      id: startup._id,
      investmentsCount: startup.activeInvestments?.length || 0,
      requestsCount: startup.requests?.length || 0
    });

    // Transform the data to match the frontend interface
    const transformedInvestments = (startup.activeInvestments || []).map((investment: Investment) => ({
      _id: investment._id.toString(),
      fundingAgencyId: {
        _id: investment.fundingAgency._id,
        userId: investment.fundingAgency.userId,
        agencyName: investment.fundingAgency.agencyDetails?.name || 'Unknown Agency',
        logo: investment.fundingAgency.agencyDetails?.logo || null
      },
      amount: investment.amount,
      date: investment.date
    }));

    const transformedRequests = (startup.requests || []).map((request: Request) => {
      // Get creation time from ObjectId or use current time as fallback
      const createdAt = request.createdAt || 
        (Types.ObjectId.isValid(request._id.toString()) 
          ? new Date(new Types.ObjectId(request._id.toString()).getTimestamp()) 
          : new Date());

      return {
        _id: request._id.toString(),
        fundingAgencyId: {
          _id: request.fundingAgency._id,
          userId: request.fundingAgency.userId,
          agencyName: request.fundingAgency.agencyDetails?.name || 'Unknown Agency',
          logo: request.fundingAgency.agencyDetails?.logo || null
        },
        message: request.message,
        createdAt: createdAt.toISOString()
      };
    });

    console.log("API Step 6: Transformed data:", {
      investmentsCount: transformedInvestments.length,
      requestsCount: transformedRequests.length,
      sampleInvestment: transformedInvestments[0] ? {
        id: transformedInvestments[0]._id,
        agencyName: transformedInvestments[0].fundingAgencyId.agencyName
      } : "No investments",
      sampleRequest: transformedRequests[0] ? {
        id: transformedRequests[0]._id,
        agencyName: transformedRequests[0].fundingAgencyId.agencyName,
        createdAt: transformedRequests[0].createdAt
      } : "No requests"
    });

    return NextResponse.json({
      activeInvestments: transformedInvestments,
      requests: transformedRequests,
    });
  } catch (error) {
    console.error("API Error: Error fetching startup fundings:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 

