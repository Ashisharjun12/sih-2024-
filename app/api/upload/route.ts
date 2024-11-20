import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Configure upload options based on file type
    const uploadOptions = {
      folder: 'startup_docs',
      resource_type: file.type.includes('pdf') ? 'raw' : 'auto',
      public_id: `${fileType}_${Date.now()}`,
      format: file.type.includes('pdf') ? 'pdf' : undefined,
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, uploadOptions);

    // Create viewable URL for PDFs
    const viewableUrl = file.type.includes('pdf')
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(result.secure_url)}&embedded=true`
      : result.secure_url;

    return NextResponse.json({
      public_id: result.public_id,
      secure_url: result.secure_url,
      viewable_url: viewableUrl,
      originalName: file.name,
      fileType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
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