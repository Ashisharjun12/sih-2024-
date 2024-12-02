import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import IPR from "@/models/ipr.model";
import Startup from "@/models/startup.model";
import User from "@/models/user.model";

interface IPRDocument extends Document {
    title: string;
    description: string;
    type: string;
    filingDate: Date;
    status: string;
    relatedDocuments: Array<{
        public_id: string;
        secure_url: string;
    }>;
}

// GET endpoint to fetch all IPRs for a startup
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "startup") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Find the startup
        const startup = await Startup.findOne({
            userId: session.user.id
        });

        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }

        // Now populate the IPR data
        const populatedStartup = await Startup.findById(startup._id)
            .populate({
                path: 'allIPR.ipr',
                model: IPR
            })
            .populate({
                path: 'allIPR.iprProfessional',
                model: User,
                select: 'name email'
            });
        

        // Extract IPRs from the startup with proper typing
        const iprs = populatedStartup.allIPR.map((item: {
            ipr: IPRDocument;
            iprProfessional: { name: string; email: string } | null;
            message: string;
        }) => ({
            ipr: item.ipr,
            iprProfessional: item.iprProfessional,
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

        // Find the startup without validation
        const startup = await Startup.findOne({ userId: session.user.id }).select('_id');
        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }

        // Parse request body
        const iprData = await req.json();

        try {
            // Create new IPR document
            const newIPR = new IPR({
                ...iprData,
                ownerType: 'Startup',
                owner: startup._id,
                status: 'Pending',
                filingDate: new Date(),
            });

            // Save the IPR
            await newIPR.save();

            // Update startup's allIPR array without validation
            await Startup.findByIdAndUpdate(
                startup._id,
                {
                    $push: {
                        allIPR: {
                            ipr: newIPR._id,
                            message: "IPR filing initiated"
                        }
                    }
                },
                { new: true, runValidators: false }
            );

            return NextResponse.json({
                message: "IPR created successfully",
                ipr: newIPR
            }, { status: 201 });

        } catch (saveError) {
            console.error("Error saving IPR:", saveError);
            return NextResponse.json(
                { error: "Failed to save IPR" },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Error creating IPR:", error);
        return NextResponse.json(
            { 
                error: "Internal Server Error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
