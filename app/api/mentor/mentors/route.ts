import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
  try {
    await connectDB();

    const mentors = await User.aggregate([
      {
        $match: { role: "mentor" }
      },
      {
        $lookup: {
          from: "mentors",
          localField: "_id",
          foreignField: "userId",
          as: "mentorDetails"
        }
      },
      {
        $unwind: "$mentorDetails"
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          expertise: "$mentorDetails.expertise",
          hourlyRate: "$mentorDetails.hourlyRate"
        }
      }
    ]);

    return NextResponse.json({ success: true, mentors });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
