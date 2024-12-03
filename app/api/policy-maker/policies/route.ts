import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Policy from "@/models/policy.model";
import PolicyMaker from "@/models/policy-maker.model";

// GET all policies
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "policyMaker") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        console.log("Authorized");

        await connectDB();

        const policyMaker = await PolicyMaker.findOne({ userId: session.user.id });
        if (!policyMaker) {
            return NextResponse.json(
                { error: "Policy maker not found" },
                { status: 404 }
            );
        }

        const policies = await Policy.find()
            .select({
                title: 1,
                description: 1,
                vision: 1,
                objectives: 1,
                sectors: 1,
                industries: 1,
                metrics: 1,
                createdAt: 1
            })
            .sort({ createdAt: -1 });
            console.log(policies)

        return NextResponse.json({ success: true, policies });

    } catch (error) {
        console.error("Error fetching policies:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST new policy
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "policyMaker") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const policyData = await req.json();

        // Validate required fields
        const requiredFields = ['title', 'description', 'vision', 'objectives', 'sectors', 'industries'];
        for (const field of requiredFields) {
            if (!policyData[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Create new policy
        const policy = await Policy.create({
            ...policyData,
            metrics: {
                totalReviews: 0,
                startupReviews: 0,
                researcherReviews: 0,
                fundingAgencyReviews:0
            }
        });

        return NextResponse.json({
            success: true,
            policy
        });

    } catch (error) {
        console.error("Error creating policy:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 