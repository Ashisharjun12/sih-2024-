import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wallet from "@/models/wallet.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ensureWallet } from "@/lib/wallet";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await request.json();
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    await connectDB();
    const wallet = await ensureWallet(session.user.id);

    // Add transaction
    wallet.transactions.push({
      type: 'credit',
      amount: amount,
      description: 'Money added to wallet',
      category: 'deposit',
      status: 'completed'
    });

    // Update balance
    wallet.balance += amount;
    await wallet.save();

    return NextResponse.json({
      success: true,
      balance: wallet.balance,
      transaction: wallet.transactions[wallet.transactions.length - 1]
    });

  } catch (error) {
    console.error("Error adding money:", error);
    return NextResponse.json(
      { error: "Failed to add money" },
      { status: 500 }
    );
  }
} 