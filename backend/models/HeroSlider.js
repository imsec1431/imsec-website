import mongoose from "mongoose";

const heroSliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
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

export default mongoose.model("HeroSlider", heroSliderSchema);
