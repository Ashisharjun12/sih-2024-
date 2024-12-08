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
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "fundingAgency") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await connectDB();

    const fundingAgency = await FundingAgency.findOne({ userId: session.user.id });
    if (!fundingAgency) {
      return NextResponse.json({ error: "Funding agency not found" }, { status: 404 });
    }

    const startup = await Startup.findById(params.id);
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Add request to funding agency
    startup.requests.push({
      fundingAgency: fundingAgency._id,
      message,
    });
    await startup.save();

    // Send notification to startup
    await addNotification({
      name: fundingAgency.agencyDetails.name,
      message: `${fundingAgency.agencyDetails.name} is interested in funding your startup`,
      role: "fundingAgency",
    }, startup.userId);

    return NextResponse.json({ message: "Request sent successfully" });
  } catch (error) {
    console.error("Error sending funding request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "fundingAgency") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const fundingAgency = await FundingAgency.findOne({ userId: session.user.id });
    if (!fundingAgency) {
      return NextResponse.json({ error: "Funding agency not found" }, { status: 404 });
    }

    // Remove request
    fundingAgency.requests = fundingAgency.requests.filter(
      (req) => req.startupId.toString() !== params.id
    );
    await fundingAgency.save();

    return NextResponse.json({ message: "Request removed successfully" });
  } catch (error) {
    console.error("Error removing funding request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 