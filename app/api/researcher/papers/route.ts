import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Researcher from "@/models/researcher.model";
import ResearchPaper from "@/models/research.model";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "researcher") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const researcher = await Researcher.findOne({ userId: session.user.id })
            .populate("researchPapers")
            .populate("onGoingResearches");

        if (!researcher) {
            return NextResponse.json({ error: "Researcher not found" }, { status: 404 });
        }

        return NextResponse.json({
            papers: [...researcher.researchPapers, ...researcher.onGoingResearches],
        });
    } catch (error) {
        console.error("Error fetching research papers:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "researcher") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { title, description, publicationDate, stage, doi, isFree, price, images, isPublished } = await req.json();
        console.log(title, description, publicationDate, stage, doi, isFree, price, images, isPublished);
        const newPaper = new ResearchPaper({
            title,
            description,
            publicationDate,
            stage,
            doi,
            isFree,
            isPublished,
            price,
            images
        });

        await newPaper.save();

        const researcher = await Researcher.findOne({ userId: session.user.id });
        if (!researcher) {
            return NextResponse.json({ error: "Researcher not found" }, { status: 404 });
        }
        console.log(researcher);
        if(stage==="Completed"){
            researcher.researchPapers.push(newPaper._id);
        }else{
            researcher.onGoingResearches.push(newPaper._id);
        }
        await researcher.save();

        return NextResponse.json({ success: true, paper: newPaper });
    } catch (error) {
        console.error("Error adding research paper:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 