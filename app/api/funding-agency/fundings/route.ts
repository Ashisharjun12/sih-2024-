import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FundingAgency from "@/models/startup.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "fundingAgency") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const fundingAgency = await FundingAgency.findOne({ userId: session.user.id })
      .populate({
        path: "activeInvestments.startup",
        select: "userId startupDetails.startupName startupDetails.startupLogo",
        model: "Startup"
      })
      .populate({
        path: "requests.startup",
        select: "userId startupDetails.startupName startupDetails.startupLogo",
        model: "Startup"
      });

    if (!fundingAgency) {
      return NextResponse.json({ error: "Funding Agency not found" }, { status: 404 });
    }

    // Transform the data to match the frontend interface
    const transformedInvestments = fundingAgency.activeInvestments.map(investment => ({
      _id: investment._id,
      startupId: {
        _id: investment.startup._id,
        userId: investment.startup.userId,
        startupName: investment.startup.startupDetails.startupName,
        startupLogo: investment.startup.startupDetails.startupLogo
      },
      amount: investment.amount,
      date: investment.date
    }));

    const transformedRequests = fundingAgency.requests.map(request => ({
      _id: request._id,
      startupId: {
        _id: request.startup._id,
        userId: request.startup.userId,
        startupName: request.startup.startupDetails.startupName,
        startupLogo: request.startup.startupDetails.startupLogo
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


export async function POST(req:NextRequest){
  try{
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "fundingAgency") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const fundingAgency = await FundingAgency.findOne({ userId: session.user.id });
    const {startupId, money}= await req.json();
    fundingAgency.activeInvestments.push({
        startup: startupId,
        amount: money,
        date: new Date()
      });
      startup.activeInvestments.push({
          fundingAgency: fundingAgency._id,
          amount: money, 
          date: new Date()
        });

  }catch(error){
    console.error("Error adding investments", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}