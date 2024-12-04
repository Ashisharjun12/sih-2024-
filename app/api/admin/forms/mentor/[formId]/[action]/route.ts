import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import Mentor from "@/models/mentor.model";
import User from "@/models/user.model";
import { sendEmail } from "@/lib/utils/email";
import { addNotification } from "@/lib/notificationService";

interface RouteParams {
    formId: string;
    action: "approve" | "reject";
}

export async function POST(
    req: NextRequest,
    { params }: { params: RouteParams }
) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { formId, action } = params;

        // Find form submission
        const formSubmission = await FormSubmission.findById(formId);
        if (!formSubmission) {
            return NextResponse.json(
                { error: "Form submission not found" },
                { status: 404 }
            );
        }

        // Find user who submitted the form
        const user = await User.findById(formSubmission.userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (action === "approve") {
            // Create mentor 
            const mentor = new Mentor({
                userId: user._id,
                name: formSubmission.formData.name,
                email: formSubmission.formData.email,
                about: formSubmission.formData.about,
                focusedIndustries: formSubmission.formData.focusedIndustries,
                focusedSectors: formSubmission.formData.focusedSectors,
                stage: formSubmission.formData.stage,
                certificates: formSubmission.formData.certificates
            });

            await mentor.save();

            // Update user role
            user.role = "mentor";
            await user.save();

            // Update form submission status
            formSubmission.status = "approved";
            await formSubmission.save();

            await addNotification({
                name: "Admin",
                message: "Your mentor application has been approved.",
                role: session.user.role!,
            }, user._id);

            // Send approval email
            await sendEmail({
                to: user.email,
                subject: "Mentor Application Approved",
                html: `
                    <h1>Congratulations!</h1>
                    <p>Your application to become a mentor has been approved.</p>
                    <p>You can now access the mentor dashboard and start helping startups.</p>
                `
            });

            return NextResponse.json({
                message: "Mentor application approved successfully"
            });

        } else if (action === "reject") {
            // Get rejection reason from request body

            // Update form submission status
            formSubmission.status = "rejected";
            await formSubmission.save();

            await addNotification({
                name: "Admin",
                message: "Your mentor application has been rejected.",
                role: session.user.role!,
            }, user._id);

            return NextResponse.json({
                message: "Mentor application rejected successfully"
            });

        } else {
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Error processing mentor application:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch form details
export async function GET(
    req: NextRequest,
    { params }: { params: { formId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const formSubmission = await FormSubmission.findById(params.formId)
            .populate('userId', 'email name');

        if (!formSubmission) {
            return NextResponse.json(
                { error: "Form submission not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(formSubmission);

    } catch (error) {
        console.error("Error fetching form details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
