import mongoose from "mongoose";

const libraryGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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

export default mongoose.model("LibraryGallery", libraryGallerySchema);
