import mongoose from "mongoose";

const departmentResearchAboutSchema = new mongoose.Schema(
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
      default: "Research",
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

const DepartmentResearchAbout = mongoose.model(
  "DepartmentResearchAbout",
  departmentResearchAboutSchema,
);

export default DepartmentResearchAbout;
