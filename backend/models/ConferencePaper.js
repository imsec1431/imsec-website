import mongoose from "mongoose";

const conferencePaperSchema = new mongoose.Schema(
  {
    paperTitle: {
      type: String,
      required: true,
      trim: true,
    },

    authors: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    conferenceName: {
      type: String,
      required: true,
      trim: true,
    },

    conferenceVenue: {
      type: String,
      default: "",
      trim: true,
    },

    conferenceDate: {
      type: Date,
      default: null,
    },

    publicationYear: {
      type: Number,
      required: true,
      min: 1900,
      max: 3000,
    },

    identifier: {
      type: String,
      default: "",
      trim: true,
    },

    publisher: {
      type: String,
      default: "",
      trim: true,
    },

    indexingDatabase: {
      type: String,
      default: "",
      trim: true,
    },

    isbn: {
      type: String,
      default: "",
      trim: true,
    },

    doi: {
      type: String,
      default: "",
      trim: true,
    },

    paperLink: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ConferencePaper", conferencePaperSchema);
