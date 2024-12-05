import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPDFView } from "@/lib/appwrite";

export async function GET(
    request: Request,
    { params }: { params: { fileId: string } }
) {
    try {
        console.log('PDF view request received:', { fileId: params.fileId });

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            console.log('Unauthorized access attempt:', { 
                fileId: params.fileId,
                user: session?.user?.email 
            });
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log('Authorized user accessing PDF:', { 
            fileId: params.fileId,
            user: session.user.email 
        });

        const { fileId } = params;

        // Get view URL
        const result = await getPDFView(fileId);

        console.log('PDF view URL generated:', { 
            fileId,
            url: result.href 
        });

        return NextResponse.json({ url: result.href });

    } catch (error) {
        console.error('PDF fetch error:', {
            fileId: params.fileId,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json(
            { error: "Failed to fetch PDF" },
            { status: 500 }
        );
    }
} 