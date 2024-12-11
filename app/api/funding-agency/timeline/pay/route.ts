import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FundingAgency from "@/models/funding-agency.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Helper function to move funding stages forward
const moveToNextStage = (timeline: any) => {
    const stages = [
        "preSeedFunding",
        "seedFunding",
        "seriesA",
        "seriesB",
        "seriesC",
        "ipo"
    ];

    let moved = false;
    for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        const currentStage = timeline[stage];
        
        // If the current stage is active, move to the next stage
        if (currentStage.isActive === "active") {
            // Mark the current stage as completed
            timeline[stage].isActive = "completed";
            
            // Move to the next stage if exists
            if (i + 1 < stages.length) {
                timeline[stages[i + 1]].isActive = "active";
            }
            moved = true;
            break;  // Exit after the first active stage is processed
        }
    }

    return moved;
};

export async function POST(req: NextRequest) {
    try {
        // Get the session and check if the user is a funding agency
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "fundingAgency") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Connect to the database
        await connectDB();

        // Parse the request body
        const { fundingAgencyId } = await req.json();

        if (!fundingAgencyId) {
            return NextResponse.json({ error: "Funding Agency ID is required" }, { status: 400 });
        }

        // Find the FundingAgency by userId from the session
        const fundingAgency = await FundingAgency.findOne({ userId: session.user.id }).populate("timeline");
        if (!fundingAgency) {
            return NextResponse.json({ error: "Funding Agency not found" }, { status: 404 });
        }

        // Check if the funding agency has an associated timeline
        if (!fundingAgency.timeline) {
            return NextResponse.json({ error: "Funding agency does not have an associated timeline" }, { status: 404 });
        }

        // Move to the next stage in the funding timeline
        const moved = moveToNextStage(fundingAgency.timeline);

        // If no stages were moved, it means all stages are completed or there's an issue
        if (!moved) {
            return NextResponse.json({ error: "No active stages found or all stages are already completed" }, { status: 400 });
        }

        // Save the updated timeline and funding agency
        await fundingAgency.timeline.save(); // Save the updated timeline
        await fundingAgency.save(); // Save the updated funding agency

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating fundraising status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
