import mongoose from "mongoose";

const departmentResearchConferencePaperSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    authors: {
      type: String,
      trim: true,
      default: "",
    },

    conferenceName: {
      type: String,
      trim: true,
      default: "",
    },

    conferenceLocation: {
      type: String,
      trim: true,
      default: "",
    },

    organizer: {
      type: String,
      trim: true,
      default: "",
    },

    publicationName: {
      type: String,
      trim: true,
      default: "",
    },

    isbn: {
      type: String,
      trim: true,
      default: "",
    },

    year: {
      type: String,
      trim: true,
      default: "",
    },

    date: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    url: {
      type: String,
      trim: true,
      default: "",
    },

    documentUrl: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    publicId: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
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

departmentResearchConferencePaperSchema.index({
  department: 1,
  order: 1,
});

const DepartmentResearchConferencePaper = mongoose.model(
  "DepartmentResearchConferencePaper",
  departmentResearchConferencePaperSchema,
);

export default DepartmentResearchConferencePaper;
