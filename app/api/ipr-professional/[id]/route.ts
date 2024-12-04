import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";
import Researcher from "@/models/researcher.model";
import IPR from "@/models/ipr.model";
import { Types } from "mongoose";
import User from "@/models/user.model";

interface IPRUpdate {
    ipfsID: string;
    message: string;
    status: "Pending" | "Accepted" | "Rejected";
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check authentication and role
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "iprProfessional") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        // Connect to database
        await connectDB();

        const { id } = await params;

        // Find IPR
        const ipr = await IPR.findById(id);
        if (!ipr) {
            return NextResponse.json({ error: "IPR not found" }, { status: 404 });
        }

        // Parse request body
        const { message, status }: IPRUpdate = await req.json();

        // Find owner based on ownerType
        let owner;
        if (ipr.ownerType === 'Startup') {
            owner = await Startup.findById(ipr.owner);
        } else if (ipr.ownerType === 'Researcher') {
            owner = await Researcher.findById(ipr.owner);
        }

        if (!owner) {
            return NextResponse.json({ error: `${ipr.ownerType} not found` }, { status: 404 });
        }
        // Find the IPR in owner's allIPR array
        const iprIndex = owner.allIPR.findIndex(
            (item: { ipr: Types.ObjectId }) =>
                item.ipr.toString() === id
        );

        if (iprIndex === -1) {
            return NextResponse.json({ error: "IPR reference not found in owner's records" }, { status: 404 });
        }


        const { ipr: iprId, _id } = owner.allIPR[iprIndex];
        const user = await User.findById(session?.user?.id);

        // Update the IPR professional assignment
        owner.allIPR[iprIndex] = {
            ipr: iprId,
            _id: _id,
            iprProfessional: user._id,
            message: message || ""
        };

        ipr.status = status;
        ipr.transactionHash = "WAITING";
        await ipr.save();
        await owner.save();

        return NextResponse.json({
            message: "IPR professional assigned successfully",
            ipr: {
                ...ipr.toObject(),
                owner: {
                    type: ipr.ownerType,
                    details: owner
                }
            }
        });

    } catch (err) {
        console.error("Error in IPR professional assignment:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch IPR details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        await connectDB();
        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid IPR ID" }, { status: 400 });
        }

        const ipr = await IPR.findById(id);
        if (!ipr) {
            return NextResponse.json({ error: "IPR not found" }, { status: 404 });
        }

        // Find owner based on ownerType
        let owner;
        if (ipr.ownerType === 'Startup') {
            owner = await Startup.findById(ipr.owner)
                .populate('allIPR.iprProfessional', 'name email');
        } else if (ipr.ownerType === 'Researcher') {
            owner = await Researcher.findById(ipr.owner)
                .populate('allIPR.iprProfessional', 'name email');
        }

        if (!owner) {
            return NextResponse.json({ error: `${ipr.ownerType} not found` }, { status: 404 });
        }

        return NextResponse.json({
            ipr: {
                ...ipr.toObject(),
                owner: {
                    type: ipr.ownerType,
                    details: owner
                }
            }
        });

    } catch (error) {
        console.error("Error fetching IPR details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}