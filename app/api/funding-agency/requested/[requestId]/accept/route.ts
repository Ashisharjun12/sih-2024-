import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import { FundingAgency } from "@/models/funding-agency.model";
import { Startup } from "@/models/startup.model";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    console.log("Accepting funding request:", params.requestId);

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

    // Convert requestId to ObjectId
    const requestId = new mongoose.Types.ObjectId(params.requestId);

    // Find the request in the funding agency's requests array
    const requestIndex = fundingAgency.requests.findIndex(
      (req: any) => req._id.toString() === requestId.toString()
    );

    if (requestIndex === -1) {
      console.log("Request not found");
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const request = fundingAgency.requests[requestIndex];
    
    // Check if request is already processed
    if (request.status !== "pending") {
      console.log("Request already processed");
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 400 }
      );
    }

    console.log("Updating request status to accepted");

    // Update request status in funding agency
    fundingAgency.requests[requestIndex].status = "accepted";
    await fundingAgency.save();

    // Update startup's funding request status
    const startup = await Startup.findById(request.startupId);
    if (startup) {
      const startupRequestIndex = startup.requests.findIndex(
        (req: any) => req.fundingAgencyId.toString() === fundingAgency._id.toString()
      );

      if (startupRequestIndex !== -1) {
        startup.requests[startupRequestIndex].status = "accepted";
        await startup.save();
      }
    }

    console.log("Request accepted successfully");

    return NextResponse.json({ message: "Request accepted successfully" });
  } catch (error) {
    console.error("Error in POST /api/funding-agency/requested/[requestId]/accept:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 