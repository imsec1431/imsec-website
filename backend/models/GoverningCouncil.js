import mongoose from "mongoose";

const governingCouncilSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    nominatedBy: {
      type: String,
      required: true,
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
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
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("GoverningCouncil", governingCouncilSchema);
