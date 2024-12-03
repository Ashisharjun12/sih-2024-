import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Policy from "@/models/policy.model";
import { Types } from "mongoose";
import Startup from "@/models/startup.model";
import Researcher from "@/models/researcher.model";
import FundingAgency from "@/models/funding-agency.model";

// GET single policy with reviews
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "policyMaker") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        if (!Types.ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { error: "Invalid policy ID" },
                { status: 400 }
            );
        }

        const policy = await Policy.findById(params.id);
        if (!policy) {
            return NextResponse.json(
                { error: "Policy not found" },
                { status: 404 }
            );
        }
        console.log(policy)

        // Populate reviews with proper reviewer details
        const populatedReviews = await Promise.all(policy.reviews.map(async (review) => {
            let reviewer;
            if (review.reviewerType === 'Startup') {
                reviewer = await Startup.findById(review.reviewer).select('startupDetails.startupName email _id');
                console.log(reviewer)
                return {
                    ...review.toObject(),
                    reviewer: {
                        _id: reviewer._id,
                        startupName: reviewer.startupDetails.startupName,
                        email: reviewer.email
                    }
                };
            } else if (review.reviewerType === 'Researcher') {
                reviewer = await Researcher.findById(review.reviewer).select('personalInfo.name email');
                return {
                    ...review.toObject(),
                    reviewer: {
                        _id: reviewer._id,
                        name: reviewer.personalInfo.name,
                        email: reviewer.email
                    }
                };
            }
            else {
                reviewer = await FundingAgency.findById(review.reviewer).select('agencyDetails.name owner.email');
                return {
                    ...review.toObject(),
                    reviewer: {
                        _id: reviewer._id,
                        name: reviewer.agencyDetails.name,
                        email: reviewer.owner.email
                    }
                };
            }
        }));

        const policyObject = policy.toObject();
        policyObject.reviews = populatedReviews;

        return NextResponse.json({
            success: true,
            policy: policyObject
        });

    } catch (error) {
        console.error("Error fetching policy:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PUT update policy
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "policyMaker") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const updateData = await req.json();

        const updatedPolicy = await Policy.findByIdAndUpdate(
            params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedPolicy) {
            return NextResponse.json(
                { error: "Policy not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            policy: updatedPolicy
        });

    } catch (error) {
        console.error("Error updating policy:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE policy
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "policyMaker") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const deletedPolicy = await Policy.findByIdAndDelete(params.id);

        if (!deletedPolicy) {
            return NextResponse.json(
                { error: "Policy not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Policy deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting policy:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 