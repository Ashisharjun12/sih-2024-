import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    request: Request,
    { params }: { params: { formId: string } }
) {
    try {
        console.log("Received form ID:", params.formId);
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        console.log("Fetching IPR Professional form with ID:", params.formId); // Debug log

        const submission = await FormSubmission.findById(params.formId);
        console.log("Found submission:", submission); // Debug log

        if (!submission) {
            return NextResponse.json(
                { error: "IPR Professional form submission not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error("Error fetching IPR Professional form details:", error);
        return NextResponse.json(
            { error: "Failed to fetch IPR Professional form details" },
            { status: 500 }
        );
    }
}