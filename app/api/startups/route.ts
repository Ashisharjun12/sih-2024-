import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "fundingAgency") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const startups = await Startup.find()
            .select({
                _id: 1,
                "startupDetails.startupName": 1,
                "startupDetails.startupLogo": 1,
                "startupDetails.industries": 1,
                "startupDetails.stage": 1,
            });

        return NextResponse.json({ startups });
    } catch (error) {
        console.error("Error fetching startups:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 