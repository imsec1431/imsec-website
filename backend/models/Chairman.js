import mongoose from "mongoose";

const chairmanSchema = new mongoose.Schema(
  {
    chairmanName: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Chairman", chairmanSchema);
