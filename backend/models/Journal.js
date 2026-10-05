import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    researchPaperTitle: {
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

    journal: {
      type: String,
      required: true,
      trim: true,
    },

    publicationYear: {
      type: Number,
      required: true,
      min: 1900,
      max: 3000,
    },

    indexingDatabase: {
      type: String,
      required: true,
      trim: true,
    },

    issn: {
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
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Journal", journalSchema);
