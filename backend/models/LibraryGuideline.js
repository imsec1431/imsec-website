import mongoose from "mongoose";

const libraryGuidelineSchema = new mongoose.Schema(
  {
    guideline: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("LibraryGuideline", libraryGuidelineSchema);
