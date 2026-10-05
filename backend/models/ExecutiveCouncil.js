import mongoose from "mongoose";

const executiveCouncilSchema = new mongoose.Schema(
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

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const ExecutiveCouncil = mongoose.model(
  "ExecutiveCouncil",
  executiveCouncilSchema,
);

export default ExecutiveCouncil;
