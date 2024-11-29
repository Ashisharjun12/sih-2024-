import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import IPR from "@/models/ipr.model";
import Startup from "@/models/startup.model";
import Researcher from "@/models/researcher.model";

export async function GET(
    req: NextRequest,
    { params }: { params: { type: string } }
) {
    try {
        // Check authentication and role
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "iprProfessional") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const type = await params.type;
        
        // Validate IPR type
        const validTypes = ['patents', 'trademarks', 'copyrights', 'trade_secrets'];
        if (!validTypes.includes(type)) {
            return NextResponse.json({ error: "Invalid IPR type" }, { status: 400 });
        }

        // Convert route parameter to IPR type
        const iprType = type === 'patents' ? 'Patent' :
            type === 'trademarks' ? 'Trademark' :
                type === 'copyrights' ? 'Copyright' :
                    type === 'trade_secrets' ? 'Trade Secret' : null;

        if (!iprType) {
            return NextResponse.json({ error: "Invalid IPR type" }, { status: 400 });
        }

        // Find all IPRs of the specified type
        const iprs = await IPR.find({ type: iprType });

        // Get unique owner IDs and their types
        const ownerIds = iprs.map(ipr => ipr.owner);

        // Fetch Startup owners with populated allIPR
        const startupOwners = await Startup.find({
            _id: { $in: ownerIds }
        }).populate({
            path: 'allIPR.iprProfessional',
            select: 'name email metaMaskAccount'
        });

        // Fetch Researcher owners with populated allIPR
        const researcherOwners = await Researcher.find({
            _id: { $in: ownerIds }
        }).populate({
            path: 'allIPR.iprProfessional',
            select: 'name email metaMaskAccount'
        });

        // Create a map of owners for quick lookup
        const ownerMap = new Map();

        // Map Startup owners
        startupOwners.forEach(startup => {
            ownerMap.set(startup._id.toString(), {
                _id: startup._id,
                startupName: startup.startupDetails.startupName,
                email: startup.owner.email,
                phone: startup.owner.phone,
                businessAddress: startup.owner.businessAddress,
                allIPR: startup.allIPR
            });
        });

        // Map Researcher owners
        researcherOwners.forEach(researcher => {
            ownerMap.set(researcher._id.toString(), {
                _id: researcher._id,
                name: researcher.personalInfo.name,
                email: researcher.personalInfo.email.address,
                phone: researcher.personalInfo.phone.number,
                institution: researcher.academicInfo.institution,
                department: researcher.academicInfo.department,
                position: researcher.academicInfo.position,
                fieldOfResearch: researcher.personalInfo.fieldOfResearch,
                allIPR: researcher.allIPR
            });
        });

        // Format the response
        const formattedIPRs = iprs.map(ipr => {
            const owner = ownerMap.get(ipr.owner.toString());
            return {
                _id: ipr._id,
                title: ipr.title,
                description: ipr.description,
                filingDate: ipr.filingDate,
                status: ipr.status,
                ownerType: ipr.ownerType,
                owner: {
                    ...owner,
                    allIPR: owner.allIPR.map((item: any) => ({
                        ipr: item.ipr,
                        iprProfessional: item.iprProfessional,
                        message: item.message
                    }))
                },
                relatedDocuments: ipr.relatedDocuments,
                transactionHash: ipr.transactionHash
            };
        });

        return NextResponse.json(formattedIPRs);

    } catch (error) {
        console.error("Error fetching IPRs:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
