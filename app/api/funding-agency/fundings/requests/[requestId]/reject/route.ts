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
        path: "requests.startup",
        select: "userId startupDetails.startupName startupDetails.startupLogo",
        model: "Startup"
      });

    if (!fundingAgency) {
      return NextResponse.json({ error: "Funding Agency not found" }, { status: 404 });
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

    // Remove request from both startup and funding agency
    fundingAgency.requests = fundingAgency.requests.filter(
      (req) => req._id.toString() !== params.requestId
    );

    // Send notification to funding agency
    await addNotification({
      name: fundingAgency.agencyDetails.name,
      message: `${fundingAgency.agencyDetails.name} has accepted your funding request. You can now proceed with the investment discussion.`,
      role: "fundingAgency",
    }, startup.userId);

    const requested = startup.requested.map((req)=>req.fundingAgency === fundingAgency._id);
    requested.status = "rejected";
    await startup.save();
    await fundingAgency.save();

    return NextResponse.json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting funding request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 