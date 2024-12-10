import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FundingAgency from "@/models/funding-agency.model";
import Startup from "@/models/startup.model";
import { addNotification } from "@/lib/notificationService";
import { NextRequest } from "next/server";

interface Investment {
  _id: string;
  startup: {
    _id: string;
    userId: string;
    startupDetails: {
      startupName: string;
      startupLogo?: {
        secure_url: string;
      };
    };
  };
  amount: number;
  date: Date;
}

interface Request {
  _id: string;
  startup: {
    _id: string;
    userId: string;
    startupDetails: {
      startupName: string;
      startupLogo?: {
        secure_url: string;
      };
    };
  };
  amount: number;
  fundingType: string;
  message: string;
  status: string;
  createdAt: Date;
}

export async function GET() {
  try {
    console.log("Step 1: Starting funding data fetch...");
    
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "fundingAgency") {
      console.log("Unauthorized access attempt:", {
        hasSession: !!session,
        role: session?.user?.role
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Step 2: Authenticated user:", {
      userId: session.user.id,
      role: session.user.role
    });

    await connectDB();
    console.log("Step 3: Database connected");

    const fundingAgency = await FundingAgency.findOne({ userId: session.user.id })
      .populate({
        path: "activeInvestments.startup",
        select: "userId startupDetails.startupName startupDetails.startupLogo",
        model: "Startup"
      })
      .populate({
        path: "requests.startup",
        select: "userId startupDetails.startupName startupDetails.startupLogo",
        model: "Startup"
      })
      .populate({
        path: "requested.startup",
        select: "userId startupDetails.startupName startupDetails.startupLogo",
        model: "Startup"
      });

    if (!fundingAgency) {
      console.log("Funding Agency not found for userId:", session.user.id);
      return NextResponse.json({ error: "Funding Agency not found" }, { status: 404 });
    }

    console.log("Step 4: Found funding agency:", {
      agencyId: fundingAgency._id,
      investmentsCount: fundingAgency.activeInvestments?.length || 0,
      requestsCount: fundingAgency.requests?.length || 0
    });

    // Transform the data to match the frontend interface
    const transformedInvestments = (fundingAgency.activeInvestments || []).map((investment: Investment) => {
      console.log("Processing investment:", investment);
      return {
        _id: investment._id,
        startup: {
          _id: investment.startup._id,
          userId: investment.startup.userId,
          startupName: investment.startup.startupDetails?.startupName || 'Unknown Startup',
          startupLogo: investment.startup.startupDetails?.startupLogo || null
        },
        amount: investment.amount,
        date: investment.date ? new Date(investment.date).toISOString() : new Date().toISOString()
      };
    });

    const transformedRequests = (fundingAgency.requests || []).map((request: Request) => {
      console.log("Processing request:", request);
      return {
        _id: request._id,
        startup: {
          _id: request.startup._id,
          userId: request.startup.userId,
          startupName: request.startup.startupDetails?.startupName || 'Unknown Startup',
          startupLogo: request.startup.startupDetails?.startupLogo || null
        },
        amount: request.amount,
        fundingType: request.fundingType,
        message: request.message,
        status: request.status || 'pending',
      };
    });

    const transformedRequested = (fundingAgency.requested || []).map((request: Request) => {
      console.log("Processing request:", request);
      return {
        _id: request._id,
        startup: {
          _id: request.startup._id,
          userId: request.startup.userId,
          startupName: request.startup.startupDetails?.startupName || 'Unknown Startup',
          startupLogo: request.startup.startupDetails?.startupLogo || null
        },
        amount: request.amount,
        fundingType: request.fundingType,
        message: request.message,
        status: request.status || 'pending',
      };
    });

    console.log("Step 5: Transformed data:", {
      investmentsCount: transformedInvestments.length,
      requestsCount: transformedRequests.length
    });

    return NextResponse.json({
      activeInvestments: transformedInvestments,
      requests: transformedRequests,
      requested: transformedRequested
    });
  } catch (error) {
    console.error("Error fetching funding agency data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Step 1: Starting investment process...");

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "fundingAgency") {
      console.log("Unauthorized access attempt:", {
        hasSession: !!session,
        role: session?.user?.role
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Step 2: Authenticated user:", {
      userId: session.user.id,
      role: session.user.role
    });

    const { startupId, amount, fundingType, message } = await req.json();
    if (!startupId || !amount || !fundingType || !message) {
      console.log("Missing required fields:", { startupId, amount, fundingType, message });
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    console.log("Step 3: Investment details:", { startupId, amount, fundingType, message });

    await connectDB();
    console.log("Step 4: Database connected");

    const fundingAgency = await FundingAgency.findOne({ userId: session.user.id });
    if (!fundingAgency) {
      console.log("Funding agency not found for userId:", session.user.id);
      return NextResponse.json({ error: "Funding agency not found" }, { status: 404 });
    }

    console.log("Step 5: Found funding agency:", {
      agencyId: fundingAgency._id,
      agencyName: fundingAgency.agencyDetails?.name
    });

    const startup = await Startup.findById(startupId);
    if (!startup) {
      console.log("Startup not found with ID:", startupId);
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    console.log("Step 6: Found startup:", {
      startupId: startup._id,
      startupName: startup.startupDetails?.startupName
    });

    // Add request to funding agency
    fundingAgency.requested.push({
      startup: startup._id,
      amount,
      fundingType,
      message,
      status: 'pending',
    });
    await fundingAgency.save();

    // Add request to startup
    startup.requests.push({
      fundingAgency: fundingAgency._id,
      amount,
      fundingType,
      message,
      status: 'pending',
    });
    await startup.save();

    // Send notification to startup
    await addNotification({
      name: fundingAgency.agencyDetails.name,
      message: `${fundingAgency.agencyDetails?.name} has sent you a funding request.`,
      role :"fundingAgency"
    }, startup.userId);

    console.log("Step 7: Request created successfully");

    return NextResponse.json({ message: "Funding request sent successfully" });
  } catch (error) {
    console.error("Error in investment process:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}