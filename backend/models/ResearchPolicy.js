import mongoose from "mongoose";

const researchPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: [
        "Research Policy",
        "IPR Policy",
        "Plagiarism Policy",
        "Research Ethics Guidelines",
      ],
      required: true,
      unique: true,
      trim: true,
    },

    pdfUrl: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ResearchPolicy", researchPolicySchema);
