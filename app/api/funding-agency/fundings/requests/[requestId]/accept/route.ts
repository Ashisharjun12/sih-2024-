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
    if (!session || session.user.role !== "fundingAgency") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const fundingAgency = await FundingAgency.findOne({ userId: session.user.id })
      .populate({
        path: "requests.startups",
        select: "userId startupDetails.startupName startupDetails.startupLogo",
        model: "Startup"
      });

    if (!fundingAgency) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Find the request
    const request = fundingAgency.requests.find(
      (req) => req._id.toString() === params.requestId
    );
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Get funding agency
    const startup = await Startup.findById(request.startup);
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // // Add to active investments
    // fundingAgency.activeInvestments.push({
    //   startups: request.startup,
    //   amount: 0, // Initial amount, will be updated during actual funding
    //   date: new Date()
    // });

    fundingAgency.requests = fundingAgency.requests.filter(
      (req) => req._id.toString() !== params.requestId
    );

    // Send notification to funding agency
    await addNotification({
      name: fundingAgency.agencyDetails.name,
      message: `${fundingAgency.agencyDetails.name} has accepted your funding request. You can now proceed with the investment discussion.`,
      role: "fundingAgency",
    }, startup.userId);

    await startup.save();
    await fundingAgency.save();

    return NextResponse.json({ 
      message: "Request accepted successfully",
      startupUserId: startup.userId
    });
  } catch (error) {
    console.error("Error accepting funding request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 