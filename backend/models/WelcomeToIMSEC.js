import mongoose from "mongoose";

const welcomePillarSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
      enum: ["GraduationCap", "Briefcase", "Building", "Microscope"],
    },

    title: {
      type: String,
      required: [true, "Pillar title is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Pillar description is required"],
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: true,
  },
);

const welcomeToIMSECSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Welcome label is required"],
      trim: true,
      maxlength: 100,
      default: "Welcome to IMSEC",
    },

    title: {
      type: String,
      required: [true, "Welcome title is required"],
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      required: [true, "Welcome description is required"],
      trim: true,
      maxlength: 1500,
    },

    imageUrl: {
      type: String,
      required: [true, "Welcome image URL is required"],
      trim: true,
    },

    pillars: {
      type: [welcomePillarSchema],
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: false,
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

welcomeToIMSECSchema.index({
  isPublished: 1,
  displayOrder: 1,
  createdAt: -1,
});

const WelcomeToIMSEC = mongoose.model("WelcomeToIMSEC", welcomeToIMSECSchema);

export default WelcomeToIMSEC;
