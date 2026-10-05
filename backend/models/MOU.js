import mongoose from "mongoose";

const mouSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      trim: true,
    },

    signingPhoto: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    director: {
      type: String,
      required: true,
      trim: true,
    },

    representative: {
      type: String,
      required: true,
      trim: true,
    },

    signedDate: {
      type: Date,
      required: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      default: "",
    },

    pdfLink: {
      type: String,
      default: "",
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

export default mongoose.model("MOU", mouSchema);
