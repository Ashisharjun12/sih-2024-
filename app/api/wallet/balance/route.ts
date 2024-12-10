import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wallet from "@/models/wallet.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ensureWallet } from "@/lib/wallet";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const wallet = await ensureWallet(session.user.id);

    return NextResponse.json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions
    });

  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
} 