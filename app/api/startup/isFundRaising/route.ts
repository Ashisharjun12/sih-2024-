import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "startup") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { isActivelyLookingForFunds } = await req.json();
        console.log(isActivelyLookingForFunds);

        // Update the startup's fundraising status
        const startup = await Startup.findOne(
            { userId: session.user.id },
        );
        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }
        startup.supportAndNetworking.isActivelyFundraising = isActivelyLookingForFunds;
        await startup.save();


        return NextResponse.json({ success: true, isActivelyLookingForFunds });
    } catch (error) {
        console.error("Error updating fundraising status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}