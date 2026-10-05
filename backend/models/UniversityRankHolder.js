import mongoose from "mongoose";

const universityRankHolderSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    rank: {
      type: Number,
      required: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    batch: {
      type: String,
      required: true,
      trim: true,
    },

    cgpa: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 1,
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

export default mongoose.model(
  "UniversityRankHolder",
  universityRankHolderSchema,
);
