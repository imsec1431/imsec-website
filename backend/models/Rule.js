import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    pdfLink: {
      type: String,
      default: "",
    },

    important: {
      type: Boolean,
      default: false,
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

export default mongoose.model("Rule", ruleSchema);
