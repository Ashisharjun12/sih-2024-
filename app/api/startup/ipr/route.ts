import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import IPR from "@/models/ipr.model";
import Startup from "@/models/startup.model";

// GET endpoint to fetch all IPRs for a startup
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "startup") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Debug session info
        console.log("Session user:", session.user);

        // Find the startup and populate their IPRs
        const startup = await Startup.findOne({ 
            userId: session.user.id  // This might be the issue - check if it's _id instead of id
        });

        // Debug startup query
        console.log("Startup query result:", startup);

        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }

        // Now populate the IPR data
        const populatedStartup = await Startup.findById(startup._id)
            .populate({
                path: 'allIPR.ipr',
                model: 'IPR'
            })
            .populate({
                path: 'allIPR.iprProffessional',
                model: 'IPRProffessional',
                select: 'name email'
            });

        // Extract IPRs from the startup
        const iprs = populatedStartup.allIPR.map((item: { 
            ipr: any; 
            iprProffessional: { name: string; email: string } | null;
            message: string;
        }) => ({
            ...item.ipr.toObject(),
            iprProfessional: item.iprProffessional,
            message: item.message
        }));

        return NextResponse.json(iprs);

    } catch (error) {
        console.error("Error fetching IPRs:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST endpoint to create a new IPR
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "startup") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Find the startup
        const startup = await Startup.findOne({ userId: session.user.id });
        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }

        // Parse request body
        const iprData = await req.json();

        // Create new IPR document
        const newIPR = new IPR({
            ...iprData,
            ownerType: 'Startup',
            owner: startup._id,
            status: 'Pending',
            filingDate: new Date(),
        });

        // Validate the IPR data
        const validationError = newIPR.validateSync();
        if (validationError) {
            return NextResponse.json(
                { error: "Validation Error", details: validationError.errors },
                { status: 400 }
            );
        }

        // Save the IPR
        await newIPR.save();

        // Add IPR reference to startup's allIPR array
        startup.allIPR.push({
            ipr: newIPR._id,
            message: "IPR filing initiated"
        });

        await startup.save();

        return NextResponse.json({
            message: "IPR created successfully",
            ipr: newIPR
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating IPR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
