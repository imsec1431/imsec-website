import mongoose from "mongoose";

const studentHandbookSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "student-handbook",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Student Handbook",
    },

    pdfUrl: {
      type: String,
      default: "",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   DEFAULT DATA
========================================================= */

export const getDefaultStudentHandbook = () => ({
  singletonKey: "student-handbook",

  title: "Student Handbook",

  pdfUrl: "",

  published: true,
});

/* =========================================================
   MODEL
========================================================= */

const StudentHandbook =
  mongoose.models.StudentHandbook ||
  mongoose.model("StudentHandbook", studentHandbookSchema);

export default StudentHandbook;
