import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import IPR from '@/models/ipr.model';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "iprProfessional") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Connect to database
        await connectDB();
        const { transactionHash } = await request.json();
        const { id } = await params;
        const ipr = await IPR.findById(id);
        ipr.transactionHash = transactionHash;
        await ipr.save();
        return NextResponse.json({ message: "Transaction hash received" });
    } catch (error) {
        console.log(error);
    }
}