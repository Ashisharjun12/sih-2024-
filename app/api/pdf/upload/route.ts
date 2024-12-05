import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadPDF } from "@/lib/appwrite";

export async function POST(request: Request) {
    try {
        console.log('PDF upload request received');

        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            console.log('Unauthorized upload attempt');
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log('Authorized user uploading PDF:', { 
            user: session.user.email 
        });

        // Get the file from form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.log('No file provided in upload request');
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        console.log('File received:', { 
            name: file.name,
            size: file.size,
            type: file.type 
        });

        // Validate file type
        if (!file.type.includes('pdf')) {
            console.log('Invalid file type:', { 
                type: file.type,
                name: file.name 
            });
            return NextResponse.json(
                { error: "Only PDF files are allowed" },
                { status: 400 }
            );
        }

        // Upload to Appwrite
        const result = await uploadPDF(file);

        console.log('Upload successful:', result);

        return NextResponse.json(result);

    } catch (error) {
        console.error('PDF upload error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json(
            { error: "Failed to upload PDF" },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}; 