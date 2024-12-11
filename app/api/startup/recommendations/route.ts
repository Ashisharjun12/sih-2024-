import FundingAgency from "@/models/funding-agency.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const ids = ["6759dc649132de56caaee820", "6759dff49132de56caaeea1d"]; // Add actual IDs here
        // // Fetch funding agencies using Promise.all for concurrent resolution
        const fundingAgencies = await Promise.all(ids.map(id => FundingAgency.findById(id)));
        console.log(fundingAgencies)
        return NextResponse.json(fundingAgencies);
    } catch (err) {
        console.error("Error fetching funding agencies:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
