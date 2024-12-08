import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'deposit',           // Adding money to wallet
      'withdrawal',        // Withdrawing money from wallet
      'meeting_payment',   // Payment for mentor meetings
      'meeting_refund',    // Refund for rejected meetings
      'research_purchase', // Buying research papers
      'research_earning',  // Earnings from selling research
      'ipr_filing',       // Payment for IPR filing
      'ipr_earning',      // Earnings from IPR services
      'funding',          // Receiving funding
      'other'             // Other transactions
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  metadata: {
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
    researchId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearchPaper' },
    iprId: { type: mongoose.Schema.Types.ObjectId, ref: 'IPR' },
    fundingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Funding' }
  },
  reference: String,      // Payment reference/transaction ID
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  transactions: [transactionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
walletSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);
export default Wallet; 