import mongoose from 'mongoose';

const policyMakerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    policies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy'
    }],
}, { timestamps: true });

const PolicyMaker = mongoose.models.PolicyMaker || mongoose.model('PolicyMaker', policyMakerSchema);

export default PolicyMaker; 