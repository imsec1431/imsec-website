import mongoose from "mongoose";

const imsSocietySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "About IMS Society",
    },

    introduction: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    vision: {
      type: String,
      default: "",
      trim: true,
    },

    mission: {
      type: String,
      default: "",
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const IMSSociety = mongoose.model("IMSSociety", imsSocietySchema);

export default IMSSociety;
