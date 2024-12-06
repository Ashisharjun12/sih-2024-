import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Client, Storage, ID } from 'appwrite';

// Initialize Appwrite
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const storage = new Storage(client);
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_PDF_BUCKET_ID!;

export async function POST(request: Request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        console.log('Starting file upload to Appwrite...', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        // Upload to Appwrite
        const fileId = ID.unique();
        const response = await storage.createFile(
            BUCKET_ID,
            fileId,
            file
        );

        // Generate URLs
        const viewUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        const previewUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

        console.log('File upload successful:', {
            fileId: response.$id,
            fileName: response.name,
            viewUrl,
            previewUrl
        });

        // Return in Cloudinary-like format
        return NextResponse.json({
            public_id: previewUrl,  // Use Appwrite file ID as public_id
            secure_url: viewUrl,      // Use view URL as secure_url
            // Additional preview URL
           
        });

    } catch (error) {
        console.error('Upload error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}; 