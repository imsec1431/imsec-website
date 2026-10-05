import mongoose from "mongoose";

const departmentResearchPolicySchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
      default: "Research Policy",
    },

    content: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const DepartmentResearchPolicy = mongoose.model(
  "DepartmentResearchPolicy",
  departmentResearchPolicySchema,
);

export default DepartmentResearchPolicy;
