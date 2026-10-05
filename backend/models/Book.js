import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Publication title is required"],
      trim: true,
    },
    authors: {
      type: String,
      required: [true, "Author(s) name is required"],
      trim: true,
    },
    department: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Publication type is required"],
      enum: ["Book", "Book Chapter", "Edited Book", "E-Book"],
      default: "Book",
    },
    publisher: {
      type: String,
      required: [true, "Publisher name is required"],
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: [true, "Publication year is required"],
      min: 1900,
      max: 3000,
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
    bookLink: {
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

export default mongoose.model("Book", bookSchema);
