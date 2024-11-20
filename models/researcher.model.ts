import mongoose from "mongoose";

const fundingAgencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  fundingAmount: { type: Number, required: true },
  fundingDate: { type: Date, required: true },
  websiteLink: String,
});

const researchFileSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  secure_url: { type: String, required: true },
});

const researchSchema = new mongoose.Schema({
  researchTopic: { type: String, required: true },
  researchDescription: { type: String, required: true },
  researchFiles: [researchFileSchema],
  researchStartDate: { type: Date, required: true },
  fundingAgency: [fundingAgencySchema],
});

const researcherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  uniqueIdType: {
    type: String,
    enum: ["aadhar", "pan", "passport"],
    required: true,
  },
  uniqueIdNumber: { type: String, required: true },
  orcid: { type: String, required: true },
  achievements: [String],
  institution: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  highestQualification: { type: String, required: true },
  yearOfExperience: { type: Number, required: true },
  researches: [researchSchema],
  profileImage: {
    public_id: String,
    secure_url: String,
  },
  documents: [{
    public_id: String,
    secure_url: String,
  }],
}, { timestamps: true });

const Researcher = mongoose.models.Researcher || mongoose.model("Researcher", researcherSchema);
export default Researcher; 