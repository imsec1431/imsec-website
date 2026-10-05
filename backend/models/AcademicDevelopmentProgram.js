import mongoose from "mongoose";

const academicDevelopmentProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Completed"],
      default: "Upcoming",
    },

    registrationLink: {
      type: String,
      default: "",
    },

    detailsLink: {
      type: String,
      default: "",
    },

    facebookLink: {
      type: String,
      default: "",
    },

    instagramLink: {
      type: String,
      default: "",
    },

    linkedinLink: {
      type: String,
      default: "",
    },

    youtubeLink: {
      type: String,
      default: "",
    },

    twitterLink: {
      type: String,
      default: "",
    },

    galleryLink: {
      type: String,
      default: "",
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

export default mongoose.model(
  "AcademicDevelopmentProgram",
  academicDevelopmentProgramSchema,
);
