import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResearchPaper from "@/models/research.model";
import Researcher from "@/models/researcher.model";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("API called");
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid research paper ID format" },
        { status: 400 }
      );
    }

    // Find research paper
    const paper = await ResearchPaper.findById(params.id).lean();

    if (!paper) {
      return NextResponse.json(
        { success: false, message: "Research paper not found" },
        { status: 404 }
      );
    }

    // Check if user has access to the paper
    let hasAccess = false;
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).lean();
      if (user) {
        console.log(user);
        hasAccess = user.accessibleResearchPapers?.some(
          (access: any) => access.researchPaper.toString() === params.id
        ) || false;
      }
    }

    // Fetch researcher details
    const researcher = await Researcher.findById(paper.researcher)
      .select({
        'personalInfo.name': 1,
        'academicInfo.institution': 1,
        'academicInfo.department': 1,
        'academicInfo.position': 1
      })
      .lean();

    if (!researcher) {
      return NextResponse.json(
        { success: false, message: "Researcher not found" },
        { status: 404 }
      );
    }

    // Combine paper and researcher data with proper typing
    const response = {
      success: true,
      data: {
        _id: paper._id,
        title: paper.title,
        description: paper.description,
        publicationDate: paper.publicationDate,
        stage: paper.stage,
        doi: paper.doi,
        isPublished: paper.isPublished,
        isFree: paper.isFree,
        price: paper.price,
        images: paper.images || [],
        hasAccess,
        researcher: {
          _id: researcher._id,
          personalInfo: {
            name: researcher.personalInfo?.name || 'Anonymous',
          },
          academicInfo: {
            institution: researcher.academicInfo?.institution || 'Not specified',
            department: researcher.academicInfo?.department || 'Not specified',
            position: researcher.academicInfo?.position || 'Not specified',
          }
        },
        createdAt: paper.createdAt,
        updatedAt: paper.updatedAt,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch research paper details";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const paper = await ResearchPaper.findById(params.id).lean();
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

    // Find user
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user already has access
    // const hasAccess = user.accessibleResearchPapers?.some(
    //   (access: any) => access.researchPaper.toString() === params.id
    // );
    console.log(paper._id, paper.isFree, user._id);
    // Add paper to user's accessible papers
   const userData=await User.findOne({_id:user._id});
   userData.accessibleResearchPapers.push({researchPaper:paper._id,accessType:paper.isFree ? 'free' : 'purchased'});
   await userData.save();
    console.log(userData);

    return NextResponse.json({ 
      success: true,
      message: paper.isFree ? "Paper added to your library" : "Paper purchased successfully",
    });

  } catch (error) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Failed to process paper access";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
} 