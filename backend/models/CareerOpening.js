import mongoose from "mongoose";

const careerOpeningSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    location: {
      type: String,
      required: true,
      default: "Ghaziabad",
      trim: true,
    },

    employmentType: {
      type: String,
      enum: ["Full Time", "Part Time", "Contract", "Internship"],
      default: "Full Time",
    },

    vacancies: {
      type: Number,
      default: 1,
      min: [1, "At least one vacancy is required"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    eligibility: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    applicationStartDate: {
      type: Date,
      default: Date.now,
    },

    applicationEndDate: {
      type: Date,
      default: null,
    },

    notificationFile: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Closed"],
      default: "Draft",
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

export default mongoose.model("CareerOpening", careerOpeningSchema);
