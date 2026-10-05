import mongoose from "mongoose";

const researchAboutSchema = new mongoose.Schema(
  {
    vision: {
      type: String,
      required: true,
      trim: true,
    },

    mission: {
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

export default mongoose.model("ResearchAbout", researchAboutSchema);
