import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import FundingAgency from "@/models/funding-agency.model";
import { addNotification } from "@/lib/notificationService";
export async function POST(
  req: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "startup") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const startup = await Startup.findOne({ userId: session.user.id })
      .populate({
        path: "requests.fundingAgency",
        select: "userId agencyName logo",
        model: "FundingAgency"
      });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Find the request
    const request = startup.requests.find(
      (req) => req._id.toString() === params.requestId
    );
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Get funding agency
    const fundingAgency = await FundingAgency.findById(request.fundingAgency);
    if (!fundingAgency) {
      return NextResponse.json({ error: "Funding agency not found" }, { status: 404 });
    }

    // Add to active investments
    // startup.activeInvestments.push({
    //   fundingAgency: request.fundingAgency,
    //   amount: 0, // Initial amount, will be updated during actual funding
    //   date: new Date()
    // });

    // Remove request from both startup and funding agency
    startup.requests = startup.requests.filter(
      (req) => req._id.toString() !== params.requestId
    );

    // Send notification to funding agency
    await addNotification({
      name: startup.startupDetails.startupName,
      message: `${startup.startupDetails.startupName} has accepted your funding request. You can now proceed with the investment discussion.`,
      role: "startup",
    }, fundingAgency.userId);

    await startup.save();
    await fundingAgency.save();

    return NextResponse.json({ 
      message: "Request accepted successfully",
      fundingAgencyUserId: fundingAgency.userId
    });
  } catch (error) {
    console.error("Error accepting funding request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 