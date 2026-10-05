import mongoose from "mongoose";

/* =========================================================
   COUNSELLING SUPPORT SCHEMA
========================================================= */

const counsellingSupportSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "counselling-support",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Counselling Support",
    },

    heading: {
      type: String,
      required: true,
      trim: true,
      default: "Student Counselling Support",
    },

    description: {
      type: String,
      default:
        "The institute provides counselling support to help students address academic, personal and career-related concerns.",
      trim: true,
    },

    counsellorName: {
      type: String,
      default: "Student Counsellor",
      trim: true,
    },

    designation: {
      type: String,
      default: "Student Counsellor",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
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

/* =========================================================
   DEFAULT DATA
========================================================= */

export const getDefaultCounsellingSupport = () => ({
  singletonKey: "counselling-support",

  title: "Counselling Support",

  heading: "Student Counselling Support",

  description:
    "The institute provides counselling support to help students address academic, personal and career-related concerns.",

  counsellorName: "Student Counsellor",

  designation: "Student Counsellor",

  email: "",

  phone: "",

  published: true,
});

/* =========================================================
   MODEL
========================================================= */

const CounsellingSupport =
  mongoose.models.CounsellingSupport ||
  mongoose.model("CounsellingSupport", counsellingSupportSchema);

export default CounsellingSupport;
