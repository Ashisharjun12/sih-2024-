import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wallet from "@/models/wallet.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ensureWallet } from "@/lib/wallet";

export async function POST(request: Request) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, amount } = await request.json();

    if (!receiverId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid transfer details" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get funding agency's wallet
    const senderWallet = await ensureWallet(authSession.user.id);
    if (senderWallet.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Get startup's wallet
    const receiverWallet = await ensureWallet(receiverId);

    // Create transaction reference
    const reference = `TXN${Date.now()}`;

    try {
      // Deduct from funding agency's wallet
      senderWallet.balance -= amount;
      senderWallet.transactions.push({
        type: 'debit',
        amount,
        description: 'Funding sent to startup',
        category: 'funding',
        reference,
        status: 'completed'
      });
      await senderWallet.save();

      // Add to startup's wallet
      receiverWallet.balance += amount;
      receiverWallet.transactions.push({
        type: 'credit',
        amount,
        description: 'Funding received',
        category: 'funding',
        reference,
        status: 'completed'
      });
      await receiverWallet.save();

      return NextResponse.json({
        success: true,
        message: "Funding transferred successfully",
        balance: senderWallet.balance
      });

    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }

  } catch (error) {
    console.error("Error transferring money:", error);
    return NextResponse.json(
      { error: "Failed to transfer money" },
      { status: 500 }
    );
  }
} 