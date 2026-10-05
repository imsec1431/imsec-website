import mongoose from "mongoose";

/* =========================================================
   ALL COMMITTEE SCHEMA
========================================================= */

const allCommitteeSchema = new mongoose.Schema(
  {
    /* =====================================================
       COMMITTEE NAME
    ===================================================== */

    committeeName: {
      type: String,

      required: [true, "Committee name is required."],

      trim: true,

      minlength: [2, "Committee name must contain at least 2 characters."],

      maxlength: [200, "Committee name cannot exceed 200 characters."],
    },

    /* =====================================================
       PDF LINK
    ===================================================== */

    pdfLink: {
      type: String,

      required: [true, "PDF link is required."],

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

    /* =====================================================
       CREATED / UPDATED
    ===================================================== */

    createdAt: {
      type: Date,

      default: Date.now,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   INDEX
========================================================= */

allCommitteeSchema.index({
  status: 1,
  displayOrder: 1,
});

/* =========================================================
   MODEL
========================================================= */

const AllCommittee = mongoose.model("AllCommittee", allCommitteeSchema);

export default AllCommittee;
