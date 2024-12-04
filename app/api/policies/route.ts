import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Policy from "@/models/policy.model";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const policies = await Policy.find();
        const filteredPolicies = policies.map(policy => ({
            ...policy.toObject(), // Convert to plain object
            reviews: policy.reviews.filter((review: { userId: string }) => review.userId.toString() === session.user.id) // Filter reviews
        }));
        console.log(filteredPolicies);
        return NextResponse.json({
            success: true,
            policies: filteredPolicies
        });

    } catch (error) {
        console.error("Error fetching policies:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 