import mongoose from "mongoose";

const researchSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{
        public_id: { type: String, default: '' },
        secure_url: { type: String, default: '' },
    }],
    publicationDate: { type: Date, required: true },
    doi: String,
    stage: {
        type: String,
        enum: [
            "Identifying a Research Problem or Question",
            "Conducting a Literature Review",
            "Formulating a Hypothesis or Research Objective",
            "Designing the Research Methodology",
            "Data Collection",
            "Data Analysis",
            "Interpreting Results",
            "Drawing Conclusions",
            "Reporting and Presenting Findings",
            "Publishing or Disseminating Results",
            "Reflection and Future Research",
            "Completed"
        ],
        required: true
    },
    isPublished: {
        type: Boolean,
    },
    isFree: {
        type: Boolean
    },
    price: {
        type: Number,
        required: function (this: { isFree: boolean }) {
            return !this.isFree;
        }
    },
    downloads: { type: Number, default: 0 },
    researcher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Researcher',
        required: true
    }
});

const ResearchPaper = mongoose.models.ResearchPaper || mongoose.model("ResearchPaper", researchSchema);

export default ResearchPaper;
