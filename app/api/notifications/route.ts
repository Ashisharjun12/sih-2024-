import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        console.log("Started fetching notifications");
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log("Session found");

        await connectDB();

        const user = await User.findById(session.user.id).populate('notifications');
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ notifications: user.notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 