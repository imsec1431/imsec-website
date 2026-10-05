import mongoose from "mongoose";

const shiningStarSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    imageAlt: {
      type: String,
      trim: true,
      default: "IMSEC Shining Star",
    },

    batch: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const ShiningStar =
  mongoose.models.ShiningStar ||
  mongoose.model("ShiningStar", shiningStarSchema);

export default ShiningStar;
