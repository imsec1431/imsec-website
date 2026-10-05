import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    // =====================================================
    // COURSE CATEGORY
    // =====================================================

    category: {
      type: String,
      required: true,
      enum: ["UG", "PG"],
      uppercase: true,
      trim: true,
    },

    // =====================================================
    // COURSE NAME
    // =====================================================

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // YEAR
    // =====================================================

    year: {
      type: String,
      required: true,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      trim: true,
    },

    // =====================================================
    // TITLE
    // =====================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // DESCRIPTION
    // =====================================================

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // PDF LINK
    // =====================================================

    pdfLink: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // DISPLAY ORDER
    // =====================================================

    displayOrder: {
      type: Number,
      default: 0,
    },

    // =====================================================
    // STATUS
    // =====================================================

    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  {
    timestamps: true,
  },
);

// =========================================================
// INDEXES
// =========================================================

// Helps public page queries such as:
// UG + B.Tech + 1st Year
courseSchema.index({
  category: 1,
  courseName: 1,
  year: 1,
});

// Helps sorting published courses
courseSchema.index({
  category: 1,
  status: 1,
  displayOrder: 1,
});

// =========================================================
// MODEL
// =========================================================

const Course = mongoose.model("Course", courseSchema);

export default Course;
