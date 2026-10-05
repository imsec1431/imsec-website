import mongoose from "mongoose";

const teachingLearningProcessSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "TeachingLearningProcess",
  teachingLearningProcessSchema,
);
