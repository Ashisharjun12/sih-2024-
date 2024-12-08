import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Startup from "@/models/startup.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "startup") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const startup = await Startup.findOne({ userId: session.user.id })
      .populate({
        path: "activeInvestments.fundingAgency",
        select: "userId agencyName logo",
        model: "FundingAgency"
      })
      .populate({
        path: "requests.fundingAgency",
        select: "userId agencyName logo",
        model: "FundingAgency"
      });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Transform the data to match the frontend interface
    const transformedInvestments = startup.activeInvestments.map(investment => ({
      _id: investment._id,
      fundingAgencyId: {
        _id: investment.fundingAgency._id,
        userId: investment.fundingAgency.userId,
        agencyName: investment.fundingAgency.agencyName,
        logo: investment.fundingAgency.logo
      },
      amount: investment.amount,
      date: investment.date
    }));

    const transformedRequests = startup.requests.map(request => ({
      _id: request._id,
      fundingAgencyId: {
        _id: request.fundingAgency._id,
        userId: request.fundingAgency.userId,
        agencyName: request.fundingAgency.agencyName,
        logo: request.fundingAgency.logo
      },
      message: request.message,
      createdAt: request._id.getTimestamp()
    }));

    return NextResponse.json({
      activeInvestments: transformedInvestments,
      requests: transformedRequests,
    });
  } catch (error) {
    console.error("Error fetching startup fundings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 

