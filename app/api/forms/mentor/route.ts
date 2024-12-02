import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import User from "@/models/user.model";

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Connect to database
        await connectDB();

        // Get user
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Parse request body
        const formData = await req.json();

        // Validate required fields
        const requiredFields = ['name', 'email', 'about', 'focusedIndustries', 'focusedSectors', 'stage'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Create form submission
        const formSubmission = new FormSubmission({
            userId: user._id,
            formType: "mentor",
            formData: {
                name: formData.name,
                email: formData.email,
                about: formData.about,
                focusedIndustries: formData.focusedIndustries,
                focusedSectors: formData.focusedSectors,
                stage: formData.stage,
                certificates: formData.certificates
            },
            status: "pending",
            userEmail: formData.email,
            userName: formData.name,
            submittedAt: new Date()
        });

        await formSubmission.save();

        return NextResponse.json({
            message: "Mentor application submitted successfully",
            formSubmission: {
                id: formSubmission._id,
                status: formSubmission.status
            }
        });

    } catch (error) {
        console.error("Error in mentor form submission:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
