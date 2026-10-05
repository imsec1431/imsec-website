import mongoose from "mongoose";

// ======================================================
// UPTAC COUNSELLING SCHEMA
// ======================================================

const uptacCounsellingSchema = new mongoose.Schema(
  {
    // ==================================================
    // CURRENT SESSION
    // ==================================================

    session: {
      type: String,

      required: true,

      trim: true,

      default: "2026-27",
    },

    // ==================================================
    // TITLE
    // ==================================================

    title: {
      type: String,

      required: true,

      trim: true,

      default: "UPTAC Counselling 2026-27",
    },

    // ==================================================
    // DESCRIPTION
    // ==================================================

    description: {
      type: String,

      trim: true,

      default: "",
    },

    // ==================================================
    // CLOUDINARY PDF URL
    // ==================================================

    pdfFile: {
      type: String,

      required: true,

      trim: true,
    },

    // ==================================================
    // ORIGINAL FILE NAME
    // ==================================================

    pdfOriginalName: {
      type: String,

      required: true,

      trim: true,
    },

    // ==================================================
    // CLOUDINARY PUBLIC ID
    // ==================================================

    cloudinaryPublicId: {
      type: String,

      required: true,

      trim: true,
    },

    // ==================================================
    // CLOUDINARY RESOURCE TYPE
    //
    // PDF = raw
    // ==================================================

    cloudinaryResourceType: {
      type: String,

      default: "raw",

      trim: true,
    },

    // ==================================================
    // PUBLISHED STATUS
    // ==================================================

    isPublished: {
      type: Boolean,

      default: false,
    },

    // ==================================================
    // DISPLAY ORDER
    // ==================================================

    displayOrder: {
      type: Number,

      default: 1,
    },

    // ==================================================
    // CREATED BY ADMIN
    // ==================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Admin",

      default: null,
    },

    // ==================================================
    // UPDATED BY ADMIN
    // ==================================================

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

// ======================================================
// INDEX
// ======================================================

uptacCounsellingSchema.index({
  session: 1,

  isPublished: 1,
});

export default mongoose.model("UptacCounselling", uptacCounsellingSchema);
