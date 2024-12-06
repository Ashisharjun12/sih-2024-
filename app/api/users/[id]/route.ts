import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextApiResponse } from "next";


import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req:NextRequest,{params}:{params:{id:string}}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        await connectDB();
        const { id } = params;
        const user = await User.findById(id);
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}   