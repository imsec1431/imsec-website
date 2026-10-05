import mongoose from "mongoose";

/* =========================================================
   MAJOR RECRUITER SCHEMA
========================================================= */

const majorRecruiterSchema = new mongoose.Schema(
  {
    /* =====================================================
       COMPANY NAME
    ===================================================== */

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       COMPANY LOGO
    ===================================================== */

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       CLOUDINARY PUBLIC ID
    ===================================================== */

    logoPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       LOGO ALT TEXT
    ===================================================== */

    logoAlt: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       COMPANY WEBSITE
    ===================================================== */

    website: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       SHORT DESCRIPTION
    ===================================================== */

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       RECRUITER CATEGORY
    ===================================================== */

    category: {
      type: String,
      enum: ["major-recruiter", "top-recruiter", "industry-partner", "other"],
      default: "major-recruiter",
    },

    /* =====================================================
       DISPLAY ORDER
    ===================================================== */

    order: {
      type: Number,
      default: 0,
    },

    /* =====================================================
       PUBLISHED STATUS
    ===================================================== */

    isPublished: {
      type: Boolean,
      default: true,
    },

    /* =====================================================
       CREATED BY
    ===================================================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    /* =====================================================
       UPDATED BY
    ===================================================== */

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   INDEXES
========================================================= */

majorRecruiterSchema.index({
  order: 1,
});

majorRecruiterSchema.index({
  isPublished: 1,
});

majorRecruiterSchema.index({
  companyName: 1,
});

/* =========================================================
   MODEL
========================================================= */

const MajorRecruiter = mongoose.model("MajorRecruiter", majorRecruiterSchema);

export default MajorRecruiter;
