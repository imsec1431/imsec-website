import mongoose from "mongoose";

const cdcStructureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "CDC Structure",
      trim: true,
    },

    image: {
      type: String,
      required: true,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },

    imageAlt: {
      type: String,
      default: "CDC Structure",
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

const CDCStructure = mongoose.model("CDCStructure", cdcStructureSchema);

export default CDCStructure;
