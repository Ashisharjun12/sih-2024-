import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FundingAgency from "@/models/funding-agency.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
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
        if (!fundingAgency) {
            return NextResponse.json({ error: "Funding Agency not found" }, { status: 404 });
        }

        // Check if the funding agency has an associated timeline
        if (!fundingAgency.timeline) {
            console.error("Doesn't have timeline")
            return NextResponse.json({ error: "Funding agency does not have an associated timeline" }, { status: 404 });
        }

        // Look for the first "pending" contingency form
        let form;
        for (let i = 0; i < fundingAgency.timeline.contingencyForms.length; i++) {
            if (fundingAgency.timeline.contingencyForms[i].isAccepted === "pending") {
                form = fundingAgency.timeline.contingencyForms[i];
                fundingAgency.timeline.contingencyForms[i].isAccepted = "accepted";  // Mark as accepted
                break;  // Only update the first pending form
            }
        }

        // If no pending form was found
        if (!form) {
            console.log("no form")
            return NextResponse.json({ error: "No pending contingency forms found" }, { status: 404 });
        }
        console.log(form.stageOfFunding)

        // Update the relevant funding stage with the form's funding amount
        switch (form.stageOfFunding) {
            case "preSeedFunding":
                fundingAgency.timeline.preSeedFunding.amount += form.fundingAmount;
                break;
            case "seedFunding":
                fundingAgency.timeline.seedFunding.amount += form.fundingAmount;
                break;
            case "seriesA":
                fundingAgency.timeline.seriesA.amount += form.fundingAmount;
                break;
            case "seriesB":
                fundingAgency.timeline.seriesB.amount += form.fundingAmount;
                break;
            case "seriesC":
                fundingAgency.timeline.seriesC.amount += form.fundingAmount;
                break;
            case "ipo":
                fundingAgency.timeline.ipo.amount += form.fundingAmount;
                break;
            default:
                return NextResponse.json({ error: "Unknown stage of funding" }, { status: 400 });
        }
        fundingAgency.timeline.totalAmount += form.fundingAmount;

        // Save the updated timeline and funding agency
        await fundingAgency.timeline.save();  // Save the updated timeline
        await fundingAgency.save(); // Save the updated funding agency

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating fundraising status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
