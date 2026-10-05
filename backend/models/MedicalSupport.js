import mongoose from "mongoose";

/* =========================================================
   MEDICAL SUPPORT SCHEMA
========================================================= */

const medicalSupportSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "medical-support",
    },

    /* =====================================================
       PAGE TITLE
    ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Medical Support",
    },

    /* =====================================================
       HEADING
    ===================================================== */

    heading: {
      type: String,
      required: true,
      trim: true,
      default: "Student Medical Support",
    },

    /* =====================================================
       DESCRIPTION
    ===================================================== */

    description: {
      type: String,
      required: true,
      trim: true,
      default:
        "The institute provides medical support and basic healthcare facilities to students and staff to promote their health, safety and overall well-being.",
    },

    /* =====================================================
       SUPPORT PERSON
    ===================================================== */

    supportPersonName: {
      type: String,
      required: true,
      trim: true,
      default: "Campus Health Support Team",
    },

    /* =====================================================
       DESIGNATION
    ===================================================== */

    designation: {
      type: String,
      required: true,
      trim: true,
      default: "Medical Support Services",
    },

    /* =====================================================
       EMAIL
    ===================================================== */

    email: {
      type: String,
      required: true,
      trim: true,
      default: "medicalsupport@imsec.ac.in",
    },

    /* =====================================================
       PHONE
    ===================================================== */

    phone: {
      type: String,
      required: true,
      trim: true,
      default: "+91-120-4081999",
    },

    /* =====================================================
       MEDICAL FACILITY
    ===================================================== */

    medicalFacility: {
      type: String,
      required: true,
      trim: true,
      default:
        "The institute provides basic medical assistance, first-aid facilities and necessary health support on campus. Students and staff can contact the designated support team whenever medical assistance is required.",
    },

    /* =====================================================
       PUBLISH STATUS
    ===================================================== */

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   DEFAULT DATA
========================================================= */

export const getDefaultMedicalSupport = () => ({
  singletonKey: "medical-support",

  title: "Medical Support",

  heading: "Student Medical Support",

  description:
    "The institute provides medical support and basic healthcare facilities to students and staff to promote their health, safety and overall well-being.",

  supportPersonName: "Campus Health Support Team",

  designation: "Medical Support Services",

  email: "medicalsupport@imsec.ac.in",

  phone: "+91-120-4081999",

  medicalFacility:
    "The institute provides basic medical assistance, first-aid facilities and necessary health support on campus. Students and staff can contact the designated support team whenever medical assistance is required.",

  published: true,
});

/* =========================================================
   MODEL
========================================================= */

const MedicalSupport =
  mongoose.models.MedicalSupport ||
  mongoose.model("MedicalSupport", medicalSupportSchema);

export default MedicalSupport;
