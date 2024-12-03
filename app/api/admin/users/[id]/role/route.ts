import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import PolicyMaker from "@/models/policy-maker.model";
import { Types } from "mongoose";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        if (!Types.ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { error: "Invalid user ID" },
                { status: 400 }
            );
        }

        const { role } = await req.json();

        // Start a session for transaction
        const dbSession = await connectDB().then(m => m.startSession());
        
        try {
            await dbSession.withTransaction(async () => {
                // Find the user
                const user = await User.findById(params.id);
                if (!user) {
                    throw new Error("User not found");
                }

                if (role === "policyMaker") {
                    // Check if user is already a policy maker
                    const existingPolicyMaker = await PolicyMaker.findOne({ userId: user._id });
                    if (existingPolicyMaker) {
                        throw new Error("User is already a policy maker");
                    }

                    // Update user role
                    user.role = "policyMaker";
                    await user.save({ session: dbSession });

                    // Create policy maker profile
                    await PolicyMaker.create([{
                        userId: user._id,
                        name: user.name,
                        email: user.email
                    }], { session: dbSession });

                } else if (role === "user") {
                    // Check if user is a policy maker
                    const policyMaker = await PolicyMaker.findOne({ userId: user._id });
                    if (!policyMaker) {
                        throw new Error("User is not a policy maker");
                    }

                    // Remove policy maker role
                    user.role = "user";
                    await user.save({ session: dbSession });

                    // Remove policy maker profile
                    await PolicyMaker.findOneAndDelete(
                        { userId: user._id },
                        { session: dbSession }
                    );
                } else {
                    throw new Error("Invalid role");
                }
            });

            return NextResponse.json({
                success: true,
                message: `User ${role === "policyMaker" ? "added as" : "removed from"} policy maker successfully`
            });

        } catch (error) {
            throw error;
        } finally {
            await dbSession.endSession();
        }

    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Internal Server Error"
            },
            { status: 500 }
        );
    }
} 