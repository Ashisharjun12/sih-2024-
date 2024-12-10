import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import { FundingAgency } from "@/models/funding-agency.model";
import { Startup } from "@/models/startup.model";

export async function GET() {
  try {
    console.log("Fetching funding agency requests...");
    
    // Get the current session
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.log("No session found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    console.log("Connected to database");

    // Find the funding agency
    const fundingAgency = await FundingAgency.findOne({
      email: session.user.email,
    });

    if (!fundingAgency) {
      console.log("Funding agency not found");
      return NextResponse.json(
        { error: "Funding agency not found" },
        { status: 404 }
      );
    }

    console.log("Found funding agency:", fundingAgency._id);

    // Get all requests with populated startup details
    const requests = await FundingAgency.aggregate([
      { $match: { _id: fundingAgency._id } },
      { $unwind: "$requests" },
      {
        $lookup: {
          from: "startups",
          localField: "requests.startupId",
          foreignField: "_id",
          as: "startup"
        }
      },
      { $unwind: "$startup" },
      {
        $project: {
          _id: "$requests._id",
          startup: "$startup",
          amount: "$requests.amount",
          fundingType: "$requests.fundingType",
          message: "$requests.message",
          status: "$requests.status",
          createdAt: "$requests.createdAt"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    console.log(`Found ${requests.length} requests`);

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error in GET /api/funding-agency/requested:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 