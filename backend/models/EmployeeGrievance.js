import mongoose from "mongoose";

const employeeGrievanceSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
    },

    employeeName: {
      type: String,
      required: true,
      trim: true,
    },

    employeeCode: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary File URL
    attachment: {
      type: String,
      default: "",
    },

    // Cloudinary Public ID
    publicId: {
      type: String,
      default: "",
    },

    // Complaint Status
    status: {
      type: String,
      enum: ["Pending", "Solved"],
      default: "Pending",
    },

    // Admin Remarks
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("EmployeeGrievance", employeeGrievanceSchema);
