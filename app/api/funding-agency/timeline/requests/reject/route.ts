import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FundingAgency from "@/models/funding-agency.model";
import Startup from "@/models/startup.model";
import Timeline from "@/models/timeline.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Get the session and check if the user is a funding agency
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "fundingAgency") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Connect to the database
        await connectDB();

        // Find the FundingAgency by userId from the session
        const fundingAgency = await FundingAgency.findOne({ userId: session.user.id }).populate("timeline");
        console.log(fundingAgency)
        if (!fundingAgency) {
            return NextResponse.json({ error: "Funding Agency not found" }, { status: 404 });
        }
        console.log(fundingAgency)

        // Check if the funding agency has an associated timeline
        if (!fundingAgency.timeline) {
            return NextResponse.json({ error: "Funding agency does not have an associated timeline" }, { status: 404 });
        }
        console.log(fundingAgency.timeline)
        const startup = await Startup.findOne({ timeline: fundingAgency.timeline });
        startup.timeline = undefined;
        fundingAgency.timeline = undefined;  // Set the timeline as rejected

        Timeline.deleteOne({ _id: fundingAgency.timeline });
        await startup.save();

        // Save the updated timeline and funding agency
        await fundingAgency.timeline.save();  // Save the updated timeline
        await fundingAgency.save(); // Save the updated funding agency

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating fundraising status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
