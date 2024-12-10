import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FundingAgency from "@/models/funding-agency.model";
import Startup from "@/models/startup.model";
import { addNotification } from "@/lib/notificationService";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Step 1: Starting funding request process...");
    console.log("Startup ID:", params.id);

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

    const { message } = await req.json();
    if (!message) {
      console.log("Missing message in request body");
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    console.log("Step 3: Request message:", message);

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

    const startup = await Startup.findById(params.id);
    if (!startup) {
      console.log("Startup not found for id:", params.id);
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    console.log("Step 6: Found startup:", {
      startupId: startup._id,
      startupName: startup.startupDetails?.startupName
    });

    // Add request to funding agency
    fundingAgency.requests.push({
      startup: startup._id,
      message,
    });
    await fundingAgency.save();
    console.log("Step 7: Added request to funding agency");

    // Add request to startup
    startup.requests.push({
      fundingAgency: fundingAgency._id,
      message,
    });
    await startup.save();
    console.log("Step 8: Added request to startup");

    // Send notification to startup
    await addNotification({
      name: fundingAgency.agencyDetails.name,
      message: `${fundingAgency.agencyDetails.name} is interested in funding your startup`,
      role: "fundingAgency",
    }, startup.userId);
    console.log("Step 9: Sent notification to startup");

    console.log("Step 10: Request process completed successfully");
    return NextResponse.json({ message: "Request sent successfully" });
  } catch (error) {
    console.error("Error in funding request process:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Step 1: Starting request deletion process...");
    console.log("Request ID:", params.id);

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "fundingAgency") {
      console.log("Unauthorized deletion attempt:", {
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

    const fundingAgency = await FundingAgency.findOne({ userId: session.user.id });
    if (!fundingAgency) {
      console.log("Funding agency not found for userId:", session.user.id);
      return NextResponse.json({ error: "Funding agency not found" }, { status: 404 });
    }

    console.log("Step 4: Found funding agency:", {
      agencyId: fundingAgency._id,
      requestsCount: fundingAgency.requests?.length || 0
    });

    // Remove request from funding agency
    const requestIndex = fundingAgency.requests.findIndex(
      (req) => req.startup.toString() === params.id
    );

    if (requestIndex === -1) {
      console.log("Request not found for startup:", params.id);
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    fundingAgency.requests.splice(requestIndex, 1);
    await fundingAgency.save();
    console.log("Step 5: Removed request from funding agency");

    // Remove request from startup
    const startup = await Startup.findById(params.id);
    if (startup) {
      const startupRequestIndex = startup.requests.findIndex(
        (req) => req.fundingAgency.toString() === fundingAgency._id.toString()
      );
      if (startupRequestIndex !== -1) {
        startup.requests.splice(startupRequestIndex, 1);
        await startup.save();
        console.log("Step 6: Removed request from startup");
      }
    }

    console.log("Step 7: Request deletion completed successfully");
    return NextResponse.json({ message: "Request removed successfully" });
  } catch (error) {
    console.error("Error in request deletion process:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 