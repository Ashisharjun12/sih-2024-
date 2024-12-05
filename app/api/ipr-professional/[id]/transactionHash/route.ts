import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import IPR from '@/models/ipr.model';
import { addNotification } from '@/lib/notificationService';
import IPRProfessional from '@/models/ipr-professional.model';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    
    // Check for authentication and authorization
    if (!session || session.user.role !== "iprProfessional") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    try {
        const { transactionHash } = await request.json();
        const { id } = params;

        // Find the IPR document by ID
        const ipr = await IPR.findById(id).populate("owner");
        if (!ipr) {
            return NextResponse.json({ error: "IPR not found" }, { status: 404 });
        }

        // Update the transaction hash
        ipr.transactionHash = transactionHash;

        // Find the IPR professional's name
        const iprProfessional = await IPRProfessional.findOne({ userId: session.user.id }).select("name");
        if (!iprProfessional) {
            return NextResponse.json({ error: "IPR Professional not found" }, { status: 404 });
        }

        // Notify the owner based on the IPR status
        const notificationMessage = `Your ${ipr.type} has been ${ipr.status.toLowerCase()}.`;
        await addNotification({
            name: iprProfessional.name,
            message: notificationMessage,
            role: session.user.role,
        }, ipr.owner.userId);

        // Save the updated IPR document
        await ipr.save();

        return NextResponse.json({ message: "Transaction hash received" });
    } catch (error) {
        console.error("Error processing transaction hash:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}