import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const formData = await req.json();

        // Validate required fields
        const requiredFields = ['owner', 'startupDetails'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                return NextResponse.json({ error: `${field} is required` }, { status: 400 });
            }
        }

        // Create new startup
        const startup = new Startup({
            userId: session.user.id,
            ...formData,
        });

        await startup.save();

        return NextResponse.json({ success: true, startup });
    } catch (error) {
        console.error("Error creating startup:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 