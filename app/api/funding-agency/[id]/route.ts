import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FundingAgency from "@/models/funding-agency.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const agency = await FundingAgency.findById(params.id);

    return NextResponse.json({
      success: true,
      agency
    });

  } catch (error) {
    console.error("Error fetching funding agencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch funding agencies" },
      { status: 500 }
    );
  }
} 