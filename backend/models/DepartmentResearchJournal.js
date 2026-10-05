import mongoose from "mongoose";

const departmentResearchJournalSchema = new mongoose.Schema(
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

    description: {
      type: String,
      trim: true,
      default: "",
    },

    journalName: {
      type: String,
      trim: true,
      default: "",
    },

    publisher: {
      type: String,
      trim: true,
      default: "",
    },

    issn: {
      type: String,
      trim: true,
      default: "",
    },

    volume: {
      type: String,
      trim: true,
      default: "",
    },

    issue: {
      type: String,
      trim: true,
      default: "",
    },

    year: {
      type: String,
      trim: true,
      default: "",
    },

    url: {
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

departmentResearchJournalSchema.index({
  department: 1,
  order: 1,
});

const DepartmentResearchJournal = mongoose.model(
  "DepartmentResearchJournal",
  departmentResearchJournalSchema,
);

export default DepartmentResearchJournal;
