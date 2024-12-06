import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Message from "@/models/message.model";
import Mentor from "@/models/mentor.model";
import FundingAgency from "@/models/funding-agency.model";
import Researcher from "@/models/researcher.model";
import Startup from "@/models/startup.model";
import PolicyMaker from "@/models/policy-maker.model";
import IPRProfessional from "@/models/ipr-professional.model";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get users that current user can message
    const messages = await Message.find({
      $or: [
        { sender: new mongoose.Types.ObjectId(session.user.id) }, 
        { receiver: new mongoose.Types.ObjectId(session.user.id) }
      ]
    });

    // Extract unique user IDs from messages (both senders and receivers)
    const userIds = Array.from(new Set([
      ...messages.map(message => message.sender.toString()),
      ...messages.map(message => message.receiver.toString())
    ])).filter(id => id !== session.user.id);

    // Convert string IDs to ObjectIds
    const objectIds = userIds.map(id => new mongoose.Types.ObjectId(id));

    const users = await User.find({
      _id: { $in: objectIds }
    });

    // Process user details
    await Promise.all(users.map(async (user) => {
      const id = user._id.toString();
      if (user.role === "mentor") {
        const mentor = await Mentor.findOne({ userId: id });
        if (mentor) {
          user.name = mentor.name;
          user.image = mentor.profilePicture?.secure_url;
        }
      }
      else if (user.role === "fundingAgency") {
        const fundingAgency = await FundingAgency.findOne({ userId: id });
        if (fundingAgency) {
          user.name = fundingAgency.agencyDetails?.name;
          user.image = fundingAgency.logo?.secure_url;
        }
      }
      else if (user.role === "researcher") {
        const researcher = await Researcher.findOne({ userId: id });
        if (researcher) {
          user.name = researcher.personalInfo?.name;
          user.image = researcher.documents?.profilePicture?.secure_url;
        }
      }
      else if (user.role === "startup") {
        const startup = await Startup.findOne({ userId: id });
        if (startup) {
          user.name = startup.startupDetails?.startupName;
          user.image = startup.startupDetails?.startupLogo?.secure_url;
        }
      }
    }));

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 