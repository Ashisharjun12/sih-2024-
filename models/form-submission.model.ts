import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  public_id: String,
  secure_url: String,
  viewable_url: String,
  originalName: String,
  fileType: String,
});

const formSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  formType: {
    type: String,
    enum: ["startup", "researcher", "iprProfessional", "policyMaker", "fundingAgency", "mentor"],
    required: true,
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  files: {
    identityProof: fileSchema,
    businessPlan: fileSchema,
    pitchDeck: fileSchema,
    financialProjections: fileSchema,
    incorporationCertificate: fileSchema,
    profilePicture: fileSchema,
    cv:fileSchema,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const FormSubmission = mongoose.models.FormSubmission || mongoose.model("FormSubmission", formSubmissionSchema);
export default FormSubmission; 