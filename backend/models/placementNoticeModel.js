import mongoose from "mongoose";

/* =========================================================
   PLACEMENT NOTICE SCHEMA
========================================================= */

const placementNoticeSchema = new mongoose.Schema(
  {
    /* =====================================================
       NOTICE TITLE
    ===================================================== */

    title: {
      type: String,
      required: true,
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
       NOTICE DATE
    ===================================================== */

    noticeDate: {
      type: Date,
      required: true,
    },

    /* =====================================================
       EXTERNAL DOCUMENT / PDF LINK

       IMPORTANT:
       No PDF is uploaded to our server.

       Admin enters an external PDF/document URL.
    ===================================================== */

    documentLink: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       DOCUMENT LABEL
    ===================================================== */

    documentLabel: {
      type: String,
      default: "View Notice",
      trim: true,
    },

    /* =====================================================
       NOTICE CATEGORY
    ===================================================== */

    category: {
      type: String,

      enum: [
        "placement",
        "internship",
        "training",
        "drive",
        "general",
        "other",
      ],

      default: "placement",
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

placementNoticeSchema.index({
  noticeDate: -1,
});

placementNoticeSchema.index({
  order: 1,
});

placementNoticeSchema.index({
  isPublished: 1,
});

placementNoticeSchema.index({
  category: 1,
});

/* =========================================================
   MODEL
========================================================= */

const PlacementNotice = mongoose.model(
  "PlacementNotice",
  placementNoticeSchema,
);

export default PlacementNotice;
