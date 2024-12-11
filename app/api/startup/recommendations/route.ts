import FundingAgency from "@/models/funding-agency.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const ids = ["6755f7cfc8982ecb2e0657e5", "6755f9069fc6ad8a5d7b696f"]; // Add actual IDs here
        // Fetch funding agencies using Promise.all for concurrent resolution
        const fundingAgencies = await Promise.all(ids.map(id => FundingAgency.findById(id)));
        console.log(fundingAgencies)
        return NextResponse.json(fundingAgencies);
    } catch (err) {
        console.error("Error fetching funding agencies:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
