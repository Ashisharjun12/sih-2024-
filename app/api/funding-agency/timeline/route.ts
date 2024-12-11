import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import FundingAgency from "@/models/funding-agency.model";
import Timeline from "@/models/timeline.model";

export async function GET(){
    try{
        const session = getServerSession(authOptions);
        if(!session){
            return NextResponse.json({
                message:"Unauthorized"
            },{status:401})
        }
        const fundingAgency = await FundingAgency.findOne({userId:session.user.id});
        if(!fundingAgency){
            return NextResponse.json({
                message:"Funding Agency not found"
            },{status:404})
        }
        const timelineId = await fundingAgency.timeline;
        if(!timelineId){
            return NextResponse.json({
                message:"Timeline not found"
            },{status:404})
        }
        const timeline = await Timeline.findById(timelineId);
        if(!timeline){
            return NextResponse.json({
                message:"Timeline not found"
            },{status:404})
        }
        return NextResponse.json({
            timeline
        },{status:200})
    }
    catch(err){
        return NextResponse.json({
            message:err.message
        },{status:500})
    }
}