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
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "iprProfessional") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = params;
        console.log("Processing IPR ID:", id);

        // Find IPR
        const ipr = await IPR.findById(id);
        if (!ipr) {
            return NextResponse.json({ error: "IPR not found" }, { status: 404 });
        }

        // Parse request body
        const { message, status }: IPRUpdate = await req.json();
        console.log("Update data:", { message, status });

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

        // Update IPR status using findByIdAndUpdate
        await IPR.findByIdAndUpdate(
            id,
            { 
                status,
                transactionHash: "PENDING"
            },
            { runValidators: false }
        );

        // Update owner's IPR reference using findByIdAndUpdate
        await Startup.findByIdAndUpdate(
            owner._id,
            {
                $set: {
                    [`allIPR.$[elem].message`]: message || "",
                    [`allIPR.$[elem].iprProfessional`]: session.user.id
                }
            },
            {
                arrayFilters: [{ "elem.ipr": id }],
                runValidators: false
            }
        );

        return NextResponse.json({
            success: true,
            message: "IPR status updated successfully"
        });

    } catch (error) {
        console.error("Error in IPR status update:", error);
        return NextResponse.json(
            { error: "Failed to update IPR status" },
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
