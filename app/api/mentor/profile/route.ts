import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Mentor from "@/models/mentor.model";

export async function GET() {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "mentor") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        // Find mentor profile
        const mentor = await Mentor.findOne({ userId: session.user.id })
            .select({
                name: 1,
                email: 1,
                about: 1,
                focusedIndustries: 1,
                focusedSectors: 1,
                stage: 1,
                certificates: 1,
                createdAt: 1,
                updatedAt: 1
            });

        if (!mentor) {
            return NextResponse.json(
                { error: "Mentor profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            mentor: {
                _id: mentor._id,
                name: mentor.name,
                email: mentor.email,
                about: mentor.about,
                focusedIndustries: mentor.focusedIndustries,
                focusedSectors: mentor.focusedSectors,
                stage: mentor.stage,
                certificates: mentor.certificates,
                createdAt: mentor.createdAt,
                updatedAt: mentor.updatedAt
            }
        });

    } catch (error) {
        console.error("Error fetching mentor profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Update mentor profile
export async function PUT(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "mentor") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const updateData = await req.json();

        // Validate required fields
        const requiredFields = ['name', 'email', 'about', 'focusedIndustries', 'focusedSectors', 'stage'];
        for (const field of requiredFields) {
            if (!updateData[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Update mentor profile
        const updatedMentor = await Mentor.findOneAndUpdate(
            { userId: session.user.id },
            {
                $set: {
                    name: updateData.name,
                    email: updateData.email,
                    about: updateData.about,
                    focusedIndustries: updateData.focusedIndustries,
                    focusedSectors: updateData.focusedSectors,
                    stage: updateData.stage,
                    certificates: updateData.certificates
                }
            },
            { new: true }
        ).select({
            name: 1,
            email: 1,
            about: 1,
            focusedIndustries: 1,
            focusedSectors: 1,
            stage: 1,
            certificates: 1,
            createdAt: 1,
            updatedAt: 1
        });

        if (!updatedMentor) {
            return NextResponse.json(
                { error: "Mentor profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            mentor: {
                _id: updatedMentor._id,
                name: updatedMentor.name,
                email: updatedMentor.email,
                about: updatedMentor.about,
                focusedIndustries: updatedMentor.focusedIndustries,
                focusedSectors: updatedMentor.focusedSectors,
                stage: updatedMentor.stage,
                certificates: updatedMentor.certificates,
                createdAt: updatedMentor.createdAt,
                updatedAt: updatedMentor.updatedAt
            }
        });

    } catch (error) {
        console.error("Error updating mentor profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 