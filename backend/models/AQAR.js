import mongoose from "mongoose";

const aqarSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "aqar",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "AQAR",
    },

    pdfUrl: {
      type: String,
      default: "",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* =====================================================
   DEFAULT AQAR DATA
===================================================== */

export const getDefaultAQAR = () => ({
  singletonKey: "aqar",

  title: "AQAR",

  /*
   * Admin can replace this URL.
   * Keep empty initially until the actual
   * AQAR PDF URL is provided.
   */
  pdfUrl: "",

  published: true,
});

/* =====================================================
   MODEL
===================================================== */

const AQAR = mongoose.models.AQAR || mongoose.model("AQAR", aqarSchema);

export default AQAR;
