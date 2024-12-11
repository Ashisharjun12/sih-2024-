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
        const { amount, fundingAgencyId } = await req.json();

        if (!amount || !fundingAgencyId) {
            return NextResponse.json({ error: "Amount and Funding Agency ID are required" }, { status: 400 });
        }

        // Fetch the startup associated with the current user
        const startup = await Startup.findOne({ userId: session.user.id });
        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }

        // Create a new Timeline and calculate funding distribution
        const newTimeline = new Timeline({
            totalAmount: amount
        });

        // Automatically distribute the amount according to the percentages defined in the schema
        await newTimeline.save();

        // Associate the new timeline with the startup
        startup.timeline = newTimeline._id; // Save the timeline ID to the startup model

        // Find the funding agency and associate it with the new timeline
        const fundingAgency = await FundingAgency.findById(fundingAgencyId);
        if (!fundingAgency) {
            return NextResponse.json({ error: "Funding Agency not found" }, { status: 404 });
        }

        fundingAgency.timeline = newTimeline._id; // Save the timeline ID to the funding agency model

        // Save the updates to both models
        await startup.save();
        await fundingAgency.save();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error updating fundraising status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
