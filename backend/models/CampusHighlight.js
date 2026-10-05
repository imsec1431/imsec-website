import mongoose from "mongoose";

const campusHighlightSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["News", "Event", "Achievement"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
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

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    readMore: {
      type: String,
      default: "",
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

export default mongoose.model("CampusHighlight", campusHighlightSchema);
