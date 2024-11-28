import mongoose from 'mongoose';

const iprProfessionalSchema = new mongoose.Schema({
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
    metaMaskAccount: {
        type: String,
        required: true
    },
    certifications: [{
        public_id: String,
        secure_url: String,
    }]
}, { timestamps: true });

const IPRProfessional = mongoose.models.IPRProfessional || mongoose.model('IPRProfessional', iprProfessionalSchema);

export default IPRProfessional; 