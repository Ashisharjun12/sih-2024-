import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResearchPaper from "@/models/research.model";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid paper ID format" },
        { status: 400 }
      );
    }

    // Find paper
    const paper = await ResearchPaper.findById(params.id);
    if (!paper) {
      return NextResponse.json(
        { success: false, message: "Research paper not found" },
        { status: 404 }
      );
    }

    // Check if paper is published
    if (!paper.isPublished) {
      return NextResponse.json(
        { success: false, message: "This paper is not yet published" },
        { status: 403 }
      );
    }

    // Find user and check access
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const hasAccess = user.accessibleResearchPapers?.some(
      access => access.researchPaper.toString() === params.id
    );

    if (!hasAccess && !paper.isFree) {
      return NextResponse.json(
        { success: false, message: "You don't have access to this paper" },
        { status: 403 }
      );
    }

    // Find the main document
    const mainDocument = paper.images?.find(img => img.secure_url);
    if (!mainDocument) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    // Validate secure URL
    try {
      const url = new URL(mainDocument.secure_url);
      if (!url.protocol.startsWith('https')) {
        throw new Error('Invalid document URL');
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid document URL" },
        { status: 400 }
      );
    }

    // Generate a clean filename
    const cleanFileName = paper.title
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase();

    return NextResponse.json({ 
      success: true,
      message: "Paper download initiated",
      downloadUrl: mainDocument.secure_url,
      fileName: `${cleanFileName}_paper.pdf`,
      contentType: 'application/pdf'
    });

  } catch (error) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Failed to process download request";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
} 