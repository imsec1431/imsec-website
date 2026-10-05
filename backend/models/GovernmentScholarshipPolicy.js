import mongoose from "mongoose";

/* =========================================================
   GOVERNMENT SCHOLARSHIP POLICY SCHEMA
========================================================= */

const governmentScholarshipPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,

      trim: true,

      required: true,

      default: "Government Scholarship Policies",
    },

    /*
     * PDF URL is optional initially.
     *
     * Admin can add the URL later.
     */

    pdfUrl: {
      type: String,

      trim: true,

      default: "",
    },

    isPublished: {
      type: Boolean,

      default: false,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

const GovernmentScholarshipPolicy =
  mongoose.models.GovernmentScholarshipPolicy ||
  mongoose.model(
    "GovernmentScholarshipPolicy",
    governmentScholarshipPolicySchema,
  );

export default GovernmentScholarshipPolicy;
