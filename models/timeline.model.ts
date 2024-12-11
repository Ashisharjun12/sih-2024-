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
    }
}, { timestamps: true });

timelineSchema.pre('save', function(next) {
    // Calculate funding amounts based on the totalAmount
    const totalAmount = this.totalAmount;

    // Predefined percentage distribution
    const fundingDistribution = {
        preSeed: 0.10,
        seed: 0.20,
        seriesA: 0.20,
        seriesB: 0.20,
        seriesC: 0.20,
        ipo: 0.10
    };

    this.preSeedFunding.amount = totalAmount * fundingDistribution.preSeed;
    this.seedFunding.amount = totalAmount * fundingDistribution.seed;
    this.seriesA.amount = totalAmount * fundingDistribution.seriesA;
    this.seriesB.amount = totalAmount * fundingDistribution.seriesB;
    this.seriesC.amount = totalAmount * fundingDistribution.seriesC;
    this.ipo.amount = totalAmount * fundingDistribution.ipo;

    next();
});

const Timeline = mongoose.models.Timeline || mongoose.model('Timeline', timelineSchema);

export default Timeline;