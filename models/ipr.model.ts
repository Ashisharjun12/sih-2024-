import mongoose from 'mongoose';

// Define the IPR Schema
const IPRSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['Patent', 'Trademark', 'Copyright', 'Trade Secret'],
        required: true,
    },
    ownerType: {
        type: String,
        required: true,
        enum: ['Researcher', 'Startup']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'ownerType',
        required: true,
    },
    filingDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
    relatedDocuments: [
        {
            public_id: String,
            secure_url: String,
        },
    ],
    transactionHash: {
        type: String,
        required: function (this: { status: string }) {
            return this.status === 'Accepted' || this.status === 'Rejected';
        }
    }
}, { timestamps: true });

// Create the IPR model
const IPR = mongoose.models.IPR || mongoose.model('IPR', IPRSchema);

export default IPR;
