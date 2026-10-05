import mongoose from "mongoose";

/* =========================================================
   NIRF RECORD SCHEMA
========================================================= */

const nirfRecordSchema = new mongoose.Schema(
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
   NIRF PAGE SCHEMA
========================================================= */

const nirfSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "nirf",
    },

    hero: {
      title: {
        type: String,
        default: "NIRF",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "National Institutional Ranking Framework",
        trim: true,
      },

      breadcrumb: {
        type: String,
        default: "Home / IQAC / NIRF",
        trim: true,
      },
    },

    records: {
      type: [nirfRecordSchema],
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

const NIRF = mongoose.models.NIRF || mongoose.model("NIRF", nirfSchema);

export default NIRF;
