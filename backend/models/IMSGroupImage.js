import mongoose from "mongoose";

const imsGroupImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Organizational Chart",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },

    imageAlt: {
      type: String,
      default: "IMS Engineering College Organizational Chart",
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

const IMSGroupImage = mongoose.model("IMSGroupImage", imsGroupImageSchema);

export default IMSGroupImage;
