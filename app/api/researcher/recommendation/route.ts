import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Researcher from "@/models/researcher.model";

export async function GET() {
    try {
  
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== "researcher") {
        console.log("Unauthorized access attempt:", {
          hasSession: !!session,
          role: session?.user?.role
        });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      await connectDB();
      
      const researcher = await Researcher.find({userId : session.user.id});
      console.log(researcher);
      const fieldOfResearch = researcher.personalInfo.fieldOfResearch;
      console.log(fieldOfResearch)
      const relatedResearchers = await Researcher.find({
        fieldOfResearch: { $elemMatch: { $in: fieldOfResearch } }
      });
  
      return NextResponse.json(relatedResearchers);
    } catch (error) {
      console.error("Error in investment process:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }