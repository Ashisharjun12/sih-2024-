import mongoose from "mongoose";

const researcherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 1. Personal Information
  personalInfo: {
    name: { type: String, required: true },
    email: {
      address: { type: String, required: true },
      verified: { type: Boolean, default: false }
    },
    phone: {
      number: { type: String, required: true },
      verified: { type: Boolean, default: false }
    },
    uniqueId: {
      type: { 
        type: String, 
        enum: ["AADHAR", "PAN", "PASSPORT"],
        required: true 
      },
      number: { type: String, required: true }
    },
    fieldOfResearch: { type: String, required: true }
  },

  // 2. Academic and Professional Information
  academicInfo: {
    institution: { type: String, required: true },
    position: {
      type: String,
      enum: [
        "PROFESSOR",
        "ASSOCIATE_PROFESSOR",
        "ASSISTANT_PROFESSOR",
        "RESEARCH_FELLOW",
        "POSTDOC",
        "OTHER"
      ],
      required: true
    },
    department: { type: String, required: true },
    highestQualification: {
      type: String,
      enum: ["PHD", "MASTERS", "BACHELORS", "OTHER"],
      required: true
    },
    yearsOfExperience: { type: Number, required: true }
  },

  // 3. Research Details
  researchDetails: {
    researchTopic: { type: String, required: true },
    expertiseAreas: [String],
    ongoingProjects: [String]
  },

  // 4. Professional Credentials
  professionalCredentials: {
    publicationNumber: { type: Number, default: 0 },
    researchIds: {
      orcid: String,
      googleScholar: String,
      researchGate: String
    },
    publications: [String],
    fundingAgency: String,
    achievements: [String]
  },

  // 5. Interests
  interests: {
    preferredCollaboration: {
      type: String,
      enum: ["ACADEMIC", "INDUSTRY", "BOTH"],
      default: "BOTH"
    },
    willingToMentor: { type: Boolean, default: false }
  }
}, { timestamps: true });

const Researcher = mongoose.models.Researcher || mongoose.model("Researcher", researcherSchema);
export default Researcher; 