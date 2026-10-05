import mongoose from "mongoose";

const directorSchema = new mongoose.Schema(
  {
    directorName: {
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

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Director = mongoose.model("Director", directorSchema);

export default Director;
