import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/user.model";
import ResearchPaper from "@/models/research.model";
import Researcher from "@/models/researcher.model";
import Wallet from "@/models/wallet.model";
import { addNotification } from "@/lib/notificationService";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paperId } = await request.json();

    await connectDB();

    // Get the research paper
    const paper = await ResearchPaper.findById(paperId).populate('researcher');
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // Check if paper is already purchased
    const user = await User.findById(session.user.id);
    const alreadyPurchased = user.accessibleResearchPapers.some(
      (p: any) => p.researchPaper.toString() === paperId
    );

    if (alreadyPurchased) {
      return NextResponse.json(
        { error: "You already own this paper" },
        { status: 400 }
      );
    }

    // Get buyer's wallet
    const buyerWallet = await Wallet.findOne({ userId: session.user.id });
    if (!buyerWallet || buyerWallet.balance < paper.price) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Get researcher's wallet
    const researcherWallet = await Wallet.findOne({ 
      userId: paper.researcher.userId 
    });
    if (!researcherWallet) {
      return NextResponse.json(
        { error: "Researcher wallet not found" },
        { status: 500 }
      );
    }

    // Create transaction reference
    const reference = `PAPER_${Date.now()}`;

    try {
      // Deduct from buyer's wallet
      buyerWallet.balance -= paper.price;
      buyerWallet.transactions.push({
        type: 'debit',
        amount: paper.price,
        description: `Purchase of research paper: ${paper.title}`,
        category: 'research_purchase',
        reference,
        metadata: { researchId: paper._id },
        status: 'completed'
      });
      await buyerWallet.save();

      // Add to researcher's wallet
      researcherWallet.balance += paper.price;
      researcherWallet.transactions.push({
        type: 'credit',
        amount: paper.price,
        description: 'Research paper purchase',
        category: 'research_earning',
        reference,
        metadata: { researchId: paper._id },
        status: 'completed'
      });
      await researcherWallet.save();

      // Add paper to user's accessible papers
      user.accessibleResearchPapers.push({
        researchPaper: paper._id,
        accessType: 'purchased',
        purchaseDate: new Date()
      });
      await user.save();

      // Send notification to researcher
      await addNotification({
        name: session.user.name || "A user",
        message: `purchased your research paper: ${paper.title}`,
        role: "researcher"
      }, paper.researcher.userId);

      return NextResponse.json({
        success: true,
        message: "Research paper purchased successfully",
        balance: buyerWallet.balance
      });

    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }

  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
} 