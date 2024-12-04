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
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User; 