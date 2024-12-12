import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Timeline from "@/models/timeline.model";
import Startup from "@/models/startup.model";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }
        const startup = await Startup.findOne({ userId: session.user.id });
        if (!startup) {
            return NextResponse.json({
                message: "Startup not found"
            }, { status: 404 })
        }

        console.log(startup)
        const timelineId = await startup.timeline;
        if (!timelineId) {
            return NextResponse.json({
                message: "Timeline not found"
            }, { status: 404 })
        }
        console.log(timelineId)
        const timeline = await Timeline.findById(timelineId);
        if (!timeline) {
            return NextResponse.json({
                message: "Timeline not found"
            }, { status: 404 })
        }
        return NextResponse.json({
            timeline
        }, { status: 200 })
    }
    catch (err) {
        console.log(err.message);
        return NextResponse.json({
            message: err.message
        }, { status: 500 })
    }
}