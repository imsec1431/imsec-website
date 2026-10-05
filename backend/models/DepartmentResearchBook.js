import mongoose from "mongoose";

const departmentResearchBookSchema = new mongoose.Schema(
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

    bookType: {
      type: String,
      trim: true,
      default: "Book",
    },

    bookTitle: {
      type: String,
      trim: true,
      default: "",
    },

    chapterTitle: {
      type: String,
      trim: true,
      default: "",
    },

    publisher: {
      type: String,
      trim: true,
      default: "",
    },

    publicationPlace: {
      type: String,
      trim: true,
      default: "",
    },

    isbn: {
      type: String,
      trim: true,
      default: "",
    },

    edition: {
      type: String,
      trim: true,
      default: "",
    },

    year: {
      type: String,
      trim: true,
      default: "",
    },

    pages: {
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

departmentResearchBookSchema.index({
  department: 1,
  order: 1,
});

const DepartmentResearchBook = mongoose.model(
  "DepartmentResearchBook",
  departmentResearchBookSchema,
);

export default DepartmentResearchBook;
