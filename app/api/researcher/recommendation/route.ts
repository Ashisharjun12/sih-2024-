import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Researcher from "@/models/researcher.model";

export async function GET() {
  try {
    // Authenticate the session and check for researcher role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "researcher") {
      console.log("Unauthorized access attempt:", {
        hasSession: !!session,
        role: session?.user?.role,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Define the IDs to fetch
    const ids = ["6759d5819132de56caaee694", "675a04a1efa33f4d73ed2afe"];

    // Fetch researchers by IDs concurrently
    const researchers = await Promise.all(
      ids.map(async (id) => {
        try {
          const researcher = await Researcher.findById(id);
          return researcher || { error: `Researcher with ID ${id} not found` };
        } catch (err) {
          console.error(`Error fetching researcher with ID ${id}:`, err);
          return { error: `Error fetching researcher with ID ${id}` };
        }
      })
    );

    // Fetch the profile of the current user
    const myProfile = await Researcher.findOne({ userId: session.user.id });

    return NextResponse.json({
      other: researchers,
      myProfile: myProfile || { error: "Your profile not found" },
    });
  } catch (error) {
    console.error("Error in researcher data retrieval:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
