import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    preSeedFunding:{
        isActive:{
            type:String,
            enum:["completed", "active", "pending"],
            default:"pending"
        },
        amount:Number,
    },
    seedFunding:{
        isActive:{
            type:String,
            enum:["completed", "active", "pending"],
            default:"pending"

        },
        amount:Number,
    },
    seriesA:{
        isActive:{
            type:String,
            enum:["completed", "active", "pending"],
            default:"pending"
        },
        amount:Number,
    },
    seriesB:{
        isActive:{
        type:String,
        enum:["completed", "active", "pending"],
            default:"pending"
    },
    amount:Number,
    },
    seriesC:{
        isActive:{
            type:String,
            enum:["completed", "active", "pending"],
            default:"pending"
        },
        amount:Number,
    },
    ipo:{
        isActive:{
            type:String,
            enum:["completed", "active", "pending"],
            default:"pending"
        },
        amount:Number,
    },
    totalAmount:{
        type:Number,
        required:true
    },
    contingencyForms:[{
        stageOfFunding:{
            type:String,
        },
        description:String,
        invoices:[{
            public_id:String,
            secure_url:String
        }],
        fundingAmount:Number,
        isAccepted:{
            type:String,
            enum:["pending","accepted", "rejected"],
            default:"pending"
        }
    }],
    isAccepted:{
        type:String,
        enum:["pending","accepted", "rejected"],
        default:"pending"
    },
    message:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Timeline = mongoose.models.Timeline || mongoose.model('Timeline', timelineSchema);

export default Timeline;