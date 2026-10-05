import mongoose from "mongoose";

/* =========================================================
   PLACEMENT POLICY SCHEMA
========================================================= */

const placementPolicySchema = new mongoose.Schema(
  {
    /* =========================================
       POLICY TITLE
    ========================================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* =========================================
       SHORT DESCRIPTION
    ========================================= */

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       POLICY CONTENT
    ========================================= */

    content: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       PDF LINK
       ADMIN PROVIDES THE EXTERNAL PDF URL
    ========================================= */

    pdfLink: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       DOCUMENT TITLE
    ========================================= */

    documentTitle: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       DISPLAY ORDER
    ========================================= */

    order: {
      type: Number,
      default: 0,
    },

    /* =========================================
       PUBLISHED / DRAFT
    ========================================= */

    isPublished: {
      type: Boolean,
      default: true,
    },

    /* =========================================
       CREATED BY
    ========================================= */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    /* =========================================
       UPDATED BY
    ========================================= */

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

placementPolicySchema.index({
  order: 1,
});

placementPolicySchema.index({
  isPublished: 1,
});

/* =========================================================
   MODEL
========================================================= */

const PlacementPolicy = mongoose.model(
  "PlacementPolicy",
  placementPolicySchema,
);

export default PlacementPolicy;
