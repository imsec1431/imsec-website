import mongoose from "mongoose";

/* =========================================================
   NBA RECORD SCHEMA
========================================================= */

const nbaRecordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    heading: {
      type: String,
      required: true,
      trim: true,
    },

    pdfUrl: {
      type: String,
      required: true,
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   NBA PAGE SCHEMA
========================================================= */

const nbaSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "nba",
    },

    hero: {
      title: {
        type: String,
        default: "NBA",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "National Board of Accreditation",
        trim: true,
      },

      breadcrumb: {
        type: String,
        default: "Home / IQAC / NBA",
        trim: true,
      },
    },

    records: {
      type: [nbaRecordSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

const NBA = mongoose.models.NBA || mongoose.model("NBA", nbaSchema);

export default NBA;
