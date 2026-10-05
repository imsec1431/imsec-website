import mongoose from "mongoose";

/* =========================================================
   T&P ACTIVITY SCHEMA
========================================================= */

const tpActivitySchema = new mongoose.Schema(
  {
    /* =========================================
       ACTIVITY TITLE
    ========================================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* =========================================
       DESCRIPTION
    ========================================= */

    description: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       ACTIVITY DATE
    ========================================= */

    activityDate: {
      type: Date,
      required: true,
    },

    /* =========================================
       CATEGORY
    ========================================= */

    category: {
      type: String,
      enum: [
        "placement-drive",
        "pre-placement-talk",
        "training",
        "workshop",
        "seminar",
        "internship",
        "career-guidance",
        "industry-interaction",
        "other",
      ],
      default: "placement-drive",
    },

    /* =========================================
       VENUE
    ========================================= */

    venue: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       ORGANIZATION / COMPANY
    ========================================= */

    organization: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       MAIN ACTIVITY IMAGE
    ========================================= */

    image: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       MAIN IMAGE PUBLIC ID
    ========================================= */

    imagePublicId: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       IMAGE ALT TEXT
    ========================================= */

    imageAlt: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================
       GALLERY IMAGES
    ========================================= */

    gallery: [
      {
        url: {
          type: String,
          trim: true,
        },

        publicId: {
          type: String,
          trim: true,
        },

        alt: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

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
       SOCIAL MEDIA
    ========================================= */

    socialMedia: {
      facebook: {
        type: String,
        trim: true,
        default: "",
      },

      instagram: {
        type: String,
        trim: true,
        default: "",
      },

      linkedin: {
        type: String,
        trim: true,
        default: "",
      },

      youtube: {
        type: String,
        trim: true,
        default: "",
      },

      twitter: {
        type: String,
        trim: true,
        default: "",
      },
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

tpActivitySchema.index({
  activityDate: -1,
});

tpActivitySchema.index({
  order: 1,
});

tpActivitySchema.index({
  isPublished: 1,
});

tpActivitySchema.index({
  category: 1,
});

/* =========================================================
   MODEL
========================================================= */

const TPActivity = mongoose.model("TPActivity", tpActivitySchema);

export default TPActivity;
