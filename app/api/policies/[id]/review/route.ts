import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Policy from "@/models/policy.model";
import Startup from "@/models/startup.model";
import Researcher from "@/models/researcher.model";
import FundingAgency from "@/models/funding-agency.model";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        if (session?.user?.role === "startup" || session?.user?.role === "researcher" || session?.user?.role === "fundingAgency") {
            await connectDB();

            const { message, type } = await req.json();
            if (!message?.trim()) {
                return NextResponse.json(
                    { error: "Review message is required" },
                    { status: 400 }
                );
            }
            let owner;
            if (type === "startup") {
                // Get startup details
                owner = await Startup.findOne({ userId: session.user.id })
                    .select('_id startupDetails.startupName');

                if (!owner) {
                    return NextResponse.json(
                        { error: "Startup profile not found" },
                        { status: 404 }
                    );
                }
            }
            else if (type === "researcher") {
                owner = await Researcher.findOne({ userId: session.user.id })
                    .select('_id personalInfo.name');

                if (!owner) {
                    return NextResponse.json(
                        { error: "Researcher profile not found" },
                        { status: 404 }
                    );
                }
            }
            else {
                owner = await FundingAgency.findOne({ userId: session.user.id })
                    .select('_id agencyDetails.name');

                if (!owner) {
                    return NextResponse.json(
                        { error: "Funding agency profile not found" },
                        { status: 404 }
                    );
                }
            }

            // Find policy and add review
            const policy = await Policy.findById(params.id);
            if (!policy) {
                return NextResponse.json(
                    { error: "Policy not found" },
                    { status: 404 }
                );
            }

            // Check if startup has already reviewed
            const existingReview = policy.reviews.find(
                review => review.reviewer.toString() === owner._id.toString()
            );

            if (existingReview) {
                return NextResponse.json(
                    { error: "You have already reviewed this policy" },
                    { status: 400 }
                );
            }
            const reviewTYPE = type.charAt(0).toUpperCase() + type.slice(1);

            // Add review
            await policy.addReview({
                reviewer: owner._id,
                reviewerType: reviewTYPE,
                message: message.trim(),
                createdAt: new Date()
            });

            return NextResponse.json({
                success: true,
                message: "Review submitted successfully"
            });
        } else {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Error submitting review:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        if (session?.user?.role === "startup" || session?.user?.role === "researcher" || session?.user?.role === "fundingAgency") {

            await connectDB();
            const { message, type } = await req.json();
            if (!message?.trim()) {
                return NextResponse.json(
                    { error: "Review message is required" },
                    { status: 400 }
                );
            }
            let owner;

            if (type === "startup") {
                // Get startup details
                owner = await Startup.findOne({ userId: session.user.id })
                    .select('_id');

                if (!owner) {
                    return NextResponse.json(
                        { error: "Startup profile not found" },
                        { status: 404 }
                    );
                }
            }
            else if (type === "researcher") {
                owner = Researcher.findOne({ userId: session.user.id })
                    .select('_id');

                if (!owner) {
                    return NextResponse.json(
                        { error: "Researcher profile not found" },
                        { status: 404 }
                    );
                }
            }
            else {
                owner = await FundingAgency.findOne({ userId: session.user.id })
                    .select('_id agencyDetails.name');

                if (!owner) {
                    return NextResponse.json(
                        { error: "Funding agency profile not found" },
                        { status: 404 }
                    );
                }
            }

            // Find policy and update review
            const policy = await Policy.findById(params.id);
            if (!policy) {
                return NextResponse.json(
                    { error: "Policy not found" },
                    { status: 404 }
                );
            }

            // Find and update the review
            const reviewIndex = policy.reviews.findIndex(
                review => review.reviewer.toString() === owner._id.toString()
            );

            if (reviewIndex === -1) {
                return NextResponse.json(
                    { error: "Review not found" },
                    { status: 404 }
                );
            }

            policy.reviews[reviewIndex].message = message.trim();
            await policy.save();

            return NextResponse.json({
                success: true,
                message: "Review updated successfully"
            });
        } else {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}