import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextApiResponse } from "next";


import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Researcher from "@/models/researcher.model";
import Mentor from "@/models/mentor.model";
import Startup from "@/models/startup.model";
import FundingAgency from "@/models/funding-agency.model";

export async function GET(req:NextRequest,{params}:{params:{id:string}}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        await connectDB();
        const { id } = params;
        const user = await User.findById(id);
        if(user.role === "mentor"){
            const mentor = await Mentor.findOne({userId:id});
            user.name = mentor.name;
            user.image = mentor.profilePicture.secure_url;
        }
        else if(user.role === "fundingAgency"){
            const fundingAgency = await FundingAgency.findOne({userId:id});
            user.name = fundingAgency.agencyDetails.name;
            user.image = fundingAgency.agencyDetails.logo.secure_url;
        }
        else if(user.role === "researcher"){
            const researcher = await Researcher.findOne({userId:id});
            user.name = researcher.personalInfo.name;
            user.image = researcher.documents.profilePicture.secure_url;
        }
        else if(user.role === "startup"){
            const startup = await Startup.findOne({userId:id});
            user.name = startup.startupDetails.startupName;
            user.image = startup.startupDetails.startupLogo.secure_url;
        }
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}   