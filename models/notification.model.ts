import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({

  // anme 
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["startup", "researcher", "fundingAgency", "policyMaker", "iprProfessional", "mentor", "admin"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;

