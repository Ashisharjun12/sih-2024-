import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FormSubmission from "@/models/form-submission.model";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { formData } = await req.json();

        // Validate required fields
        if (!formData.files?.identityProof) {
            return NextResponse.json(
                { error: "Identity proof is required" },
                { status: 400 }
            );
        }
        console.log(formData.files.identityProof);
        console.log(formData.files.incorporationCertificate);
        console.log(formData.files.pitchDeck);
        console.log(formData.files.startupLogo);

        // Create form submission
        const submission = new FormSubmission({
            userId: session.user.id,
            formType: "startup",
            formData: {
                owner: formData.owner,
                startupDetails: formData.startupDetails,
                businessActivities: formData.businessActivities,
                legalAndCompliance: formData.legalAndCompliance,
                isActivelyFundraising: formData.isActivelyFundraising,
                additionalInfo: {
                    ...formData.additionalInfo,
                    identityProof: {
                        public_id: formData.files.identityProof.public_id,
                        secure_url: formData.files.identityProof.secure_url,
                    },
                    pitchDeck: {
                        public_id: formData.files.pitchDeck.public_id,
                        secure_url: formData.files.pitchDeck.secure_url,
                    },
                    incorporationCertificate: {
                        public_id: formData.files.incorporationCertificate.public_id,
                        secure_url: formData.files.incorporationCertificate.secure_url,
                    }
                }
            },
            status: "pending",
            userEmail: session.user.email!,
            userName: session.user.name!
        });
        submission.formData.startupDetails.startupLogo = {
            public_id: formData.files.startupLogo.public_id,
            secure_url: formData.files.startupLogo.secure_url
        };

        await submission.save();

        return NextResponse.json({
            success: true,
            message: "Form submitted successfully"
        });

    } catch (error) {
        console.error("Error submitting startup form:", error);
        return NextResponse.json(
            { error: "Failed to submit form" },
            { status: 500 }
        );
    }
} 