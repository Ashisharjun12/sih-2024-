import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import FundingAgency from "@/models/funding-agency.model";
import { addNotification } from "@/lib/notificationService";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Step 1: Starting funding request process...");
    console.log("Agency ID:", params.id);

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "startup") {
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

    const { amount, fundingType, message } = await req.json();
    if (!amount || !fundingType || !message) {
      console.log("Missing required fields:", { amount, fundingType, message });
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    console.log("Step 3: Request details:", { amount, fundingType, message });

    await connectDB();
    console.log("Step 4: Database connected");

    const startup = await Startup.findOne({ userId: session.user.id });
    if (!startup) {
      console.log("Startup not found for userId:", session.user.id);
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    console.log("Step 5: Found startup:", {
      startupId: startup._id,
      startupName: startup.startupDetails?.startupName
    });

    const fundingAgency = await FundingAgency.findById(params.id);
    if (!fundingAgency) {
      console.log("Funding agency not found for id:", params.id);
      return NextResponse.json({ error: "Funding agency not found" }, { status: 404 });
    }

    console.log("Step 6: Found funding agency:", {
      agencyId: fundingAgency._id,
      agencyName: fundingAgency.agencyDetails?.name
    });

    // Add request to startup's requested array
    startup.requested.push({
      fundingAgency: fundingAgency._id,
      amount,
      fundingType,
      message,
      status: 'pending'
    });
    await startup.save();
    console.log("Step 7: Added request to startup's requested array");

    // Send notification to funding agency
    await addNotification({
      name: startup.startupDetails.startupName,
      message: `${startup.startupDetails.startupName} has requested funding of ₹${amount} through ${fundingType}`,
      role: "startup",
    }, fundingAgency.userId);
    console.log("Step 8: Sent notification to funding agency");

    console.log("Step 9: Request process completed successfully");
    return NextResponse.json({ message: "Funding request sent successfully" });
  } catch (error) {
    console.error("Error in funding request process:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 