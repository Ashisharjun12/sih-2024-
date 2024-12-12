import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FundingAgency from "@/models/funding-agency.model";
import Startup from "@/models/startup.model";
import Timeline from "@/models/timeline.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Get the session and check the user's role
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "startup") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Connect to the database
        await connectDB();
        // Parse the request body
        const data = await req.json();
        const { stageOfFunding, description, invoices, fundingAmount } = data;
        // Fetch the startup associated with the current user
        const startup = await Startup.findOne({ userId: session.user.id }).populate("timeline");
        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }
        startup.timeline.contingencyForms.push({
            stageOfFunding,
            description,
            invoices,
            fundingAmount: parseInt(fundingAmount),
            isAccepted: "pending"
        });

        // Save the updates to both models
        await startup.save();
        await startup.timeline.save();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error updating fundraising status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
