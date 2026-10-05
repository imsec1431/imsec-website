import mongoose from "mongoose";

/* =========================================================
   NAAC RECORD SCHEMA
========================================================= */

const naacRecordSchema = new mongoose.Schema(
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
   NAAC PAGE SCHEMA
========================================================= */

const naacSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "naac",
    },

    hero: {
      title: {
        type: String,
        default: "NAAC",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "National Assessment and Accreditation Council",
        trim: true,
      },

      breadcrumb: {
        type: String,
        default: "Home / IQAC / NAAC",
        trim: true,
      },
    },

    records: {
      type: [naacRecordSchema],
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

const NAAC = mongoose.models.NAAC || mongoose.model("NAAC", naacSchema);

export default NAAC;
