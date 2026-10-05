import mongoose from "mongoose";

const studentHandbookSchema = new mongoose.Schema(
  {
    /* =====================================================
         TITLE
      ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
         PDF LINK
      ===================================================== */

    pdfLink: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
         DISPLAY ORDER
      ===================================================== */

    displayOrder: {
      type: Number,
      default: 0,
    },

    /* =====================================================
         STATUS
      ===================================================== */

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

const StudentHandbook = mongoose.model(
  "StudentHandbook",
  studentHandbookSchema,
);

export default StudentHandbook;
