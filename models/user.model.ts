import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin", "researcher", "startup", "iprProfessional", "policyMaker", "fundingAgency", "mentor"],
    default: "user",
  },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  accessibleResearchPapers: [{
    researchPaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResearchPaper',
      required: true
    },
    accessType: {
      type: String,
      enum: ['free', 'purchased'],
      required: true
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User; 