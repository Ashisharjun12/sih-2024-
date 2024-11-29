import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import IPR from "@/models/ipr.model";
import Researcher from "@/models/researcher.model";
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

// GET endpoint to fetch all IPRs for a researcher
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "researcher") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Find the researcher
        const researcher = await Researcher.findOne({
            userId: session.user.id
        });

        if (!researcher) {
            return NextResponse.json({ error: "Researcher not found" }, { status: 404 });
        }
        console.log("researcher", researcher);

        // Now populate the IPR data
        if (researcher.allIPR.length > 0) {
            const populatedResearcher = await Researcher.findById(researcher._id).populate({
                path: 'allIPR.ipr',
                model: IPR
            }).populate({
                path: 'allIPR.iprProfessional',
                model: User,
                select: 'name email'
            });


            // Extract IPRs from the researcher with proper typing
            const iprs = populatedResearcher.allIPR.map((item: {
                ipr: IPRDocument;
                iprProfessional: { name: string; email: string } | null;
                message: string;
            }) => ({
                ipr: item.ipr,
                iprProfessional: item.iprProfessional,
                message: item.message
            }));


            return NextResponse.json(iprs);
        } else {
            return NextResponse.json([]);
        }
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
        if (!session || session.user.role !== "researcher") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Find the researcher
        const researcher = await Researcher.findOne({ userId: session.user.id });
        if (!researcher) {
            return NextResponse.json({ error: "Researcher not found" }, { status: 404 });
        }

        // Parse request body
        const iprData = await req.json();

        // Create new IPR document
        const newIPR = new IPR({
            ...iprData,
            ownerType: 'Researcher',
            owner: researcher._id,
            status: 'Pending',
            filingDate: new Date(),
        });

        // Save the IPR
        await newIPR.save();

        // Add IPR reference to researcher's allIPR array
        researcher.allIPR.push({
            ipr: newIPR._id,
            message: "IPR filing initiated"
        });

        await researcher.save();

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
