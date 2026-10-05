import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, "Platform is required"],
      enum: ["Facebook", "LinkedIn", "Instagram", "X", "YouTube"],
      unique: true,
      trim: true,
    },

    url: {
      type: String,
      required: [true, "Social media URL is required"],
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

socialMediaSchema.index({
  isActive: 1,
  displayOrder: 1,
});

const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema);

export default SocialMedia;
