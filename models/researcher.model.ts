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
    fieldOfResearch: {
      type: [String],
      enum: [
        "Artificial Intelligence (AI) and Machine Learning",
        "Climate Change and Environmental Science",
        "Biotechnology and Genetic Engineering",
        "Neuroscience",
        "Quantum Computing",
        "Nanotechnology",
        "Astrophysics and Space Research",
        "Public Health and Epidemiology",
        "Robotics",
        "Economics and Behavioral Science",
        "Materials Science",
        "Cognitive Science",
        "Pharmacology",
        "Philosophy and Ethics",
        "Sociology",
        "Political Science",
        "Educational Research",
        "Psychology",
        "Linguistics",
        "Anthropology",
        "Archaeology",
        "Biomedical Engineering",
        "Data Science",
        "Genomics",
        "Chemistry",
        "Physics",
        "Mathematics",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Renewable Energy",
        "Hydrology",
        "Oceanography",
        "Geology",
        "Agricultural Science",
        "Veterinary Science",
        "Public Administration",
        "Urban Studies and Planning",
        "Behavioral Economics",
        "Human-Computer Interaction",
        "Artificial Life",
        "Genetic Counseling",
        "Forensic Science",
        "Law and Legal Studies",
        "International Relations",
        "Sustainability Studies",
        "Game Theory",
        "Computer Vision",
        "Blockchain Technology",
        "Fashion Design and Technology"
      ],
      required: true
    }
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
  researchPapers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchPaper',
  }],
  onGoingResearches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchPaper',
  }],

  // 4. Professional Credentials
  professionalCredentials: {
      orcid: String,
      googleScholar: String,
      researchGate: String
  },

  // 6. All IPR
  allIPR: [{
    ipr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IPR',
    },
    iprProfessional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String
  }],

  // Add documents field with proper schema
  documents: {
      profilePicture: {
        public_id: { type: String, default: '' },
        secure_url: { type: String, default: '' },
      },
      cv: {
        public_id: { type: String, default: '' },
        secure_url: { type: String, default: '' },
      },
    _id: false
  },

  // Add published papers array
  publishedPapers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchPaper'
  }]
}, { timestamps: true });

const Researcher = mongoose.models.Researcher || mongoose.model("Researcher", researcherSchema);
export default Researcher; 